var eq = require('buffer-equals')
var xtend = require('xtend')
var isarray = require('isarray')
var defined = require('defined')

module.exports = function (sodium, keypair, opts) {
  if (sodium.api && !sodium.crypto_sign) sodium = sodium.api
  return xtend({
    identity: defined(keypair.identity, keypair.publicKey),
    sign: function (node, cb) {
      var bkey = Buffer(node.key, 'hex')
      cb(null, sodium.crypto_sign(bkey, keypair.secretKey))
    },
    verify: function (node, cb) {
      var m = sodium.crypto_sign_open(node.signature, node.identity)
      if (isarray(keypair.publicKey)) {
        for (var i = 0; i < keypair.publicKey.length; i++) {
          if (eq(node.identity, keypair.publicKey[i])) break
        }
        if (i === keypair.publicKey.length) return cb(null, false)
      }
      else if (!eq(node.isarray, keypair.publicKey)) cb(null, false)
 
      cb(null, eq(m, Buffer(node.key, 'hex')))
    }
  }, opts)
}
