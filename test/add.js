var hyperlog = require('hyperlog')
var memdb = require('memdb')
var hsodium = require('../')
var sodium = require('sodium')
var test = require('tape')

test('add', function (t) {
  t.plan(3)
  var keypair = sodium.api.crypto_sign_keypair()
  var log = hyperlog(memdb(), hsodium(sodium, keypair))

  log.add(null, Buffer('whatever'), function (err, node) {
    t.ifError(err)
    t.deepEqual(node.identity, keypair.publicKey)
    var m = sodium.api.crypto_sign_open(node.signature, node.identity)
    t.deepEqual(m, Buffer(node.key, 'hex'))
  })
})

test('add api', function (t) {
  t.plan(3)
  var keypair = sodium.api.crypto_sign_keypair()
  var log = hyperlog(memdb(), hsodium(sodium.api, keypair))

  log.add(null, Buffer('whatever'), function (err, node) {
    t.ifError(err)
    t.deepEqual(node.identity, keypair.publicKey)
    var m = sodium.api.crypto_sign_open(node.signature, node.identity)
    t.deepEqual(m, Buffer(node.key, 'hex'))
  })
})
