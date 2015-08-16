# hyperlog-sodium

configure hyperlog with sodium for signing and verification

# example

``` js
var hyperlog = require('hyperlog')
var hsodium = require('hyperlog-sodium')
var sodium = require('sodium')
var memdb = require('memdb')

var keypair = sodium.api.crypto_sign_keypair()
var log = hyperlog(memdb(), hsodium(sodium, keypair))

log.add(null, Buffer('whatever'), function (err, node) {
  console.log(node)
})
```

# methods

``` js
var sodium = require('sodium')
var hsodium = require('hyperlog-sodium')
```

## var hopts = hsodium(sodium, keypair, opts={})

Return `hopts` for signing and verification that can be fed into
[hyperlog](https://npmjs.com/package/hyperlog). Additional `opts` will be merged
into `hopts`.

# install

```
npm install hyperlog-sodium
```

# license

MIT
