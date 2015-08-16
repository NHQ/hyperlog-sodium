var eq = require('buffer-equals')
var xtend = require('xtend')
var isarray = require('isarray')
var defined = require('defined')

module.exports = function (sodium, keypair, opts) {
  if (sodium.api && !sodium.crypto_sign) sodium = sodium.api
  if (!opts) opts = {}
  var pub
  if (typeof opts.publicKey === 'function') {
    pub = opts.publicKey
  }
  else {
    var pub = [].concat(keypair.publicKey || [])
    if (opts.publicKey) pub = [].concat(pub, opts.publicKey)
  }
 
  return xtend({
    identity: defined(keypair.identity, keypair.publicKey),
    sign: function (node, cb) {
      var bkey = Buffer(node.key, 'hex')
      cb(null, sodium.crypto_sign(bkey, keypair.secretKey))
    },
    verify: function (node, cb) {
      var m = sodium.crypto_sign_open(node.signature, node.identity)
      if (typeof pub === 'function') {
        pub(node.identity, function (err, ok) {
          if (err) cb(err)
          else if (!ok) cb(null, false)
          else cb(null, eq(m, Buffer(node.key, 'hex')))
        })
      }
      else {
        for (var i = 0; i < pub.length; i++) {
          if (eq(node.identity, pub[i])) break
        }
        if (i === pub.length) return cb(null, false)
        cb(null, eq(m, Buffer(node.key, 'hex')))
      }
    }
  }, opts)
}
