var eq = require('buffer-equals')
var xtend = require('xtend')

module.exports = function (sodium, keypair, opts) {
  if (sodium.api && !sodium.crypto_sign) sodium = sodium.api
  return xtend({
    id: keypair.publicKey,
    sign: function (node, cb) {
      var bkey = Buffer(node.key, 'hex')
      cb(null, sodium.crypto_sign(bkey, keypair.secretKey))
    },
    verify: function (node, cb) {
      var m = sodium.crypto_sign_open(node.signature, node.identity)
      var bkey = Buffer(node.key, 'hex')
      cb(null, eq(m, bkey))
    }
  }, opts)
}
