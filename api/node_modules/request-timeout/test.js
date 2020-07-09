
var request = require('request')
var http = require('http')
var timeout = require('./index')
var PORT = process.env.PORT || 1137

var server = http.createServer(handleRequest)

function handleRequest(req, res) {
  timeout(req, res, 2)

  req.once('timeout', handleTimeout)
}

function wait(seconds, cb) {
  var args = Array.prototype.slice.call(arguments, 2)
  setTimeout(function() {
    cb.apply(this, args)
  }, seconds * 1000)
}

function handleTimeout(req, res) {
  console.log('Timeout expired correctly')
  req.timeout.start(2)
  wait(1, cancelTimeout, req, res)
}

function cancelTimeout(req, res) {
  req.timeout.clear()
  req.once('timeout', function() { console.error('Timeout expired after it was cancelled') })
  wait(2, done, req, res)
}

function done(req, res) {
  console.log('Timeout cancelled successfully')
  console.log('All tests passed')
  res.end()
}

server.listen(PORT, function() {
  req()
})

function req() {
  request.get('http://localhost:' + PORT, function() { server.close() })
}
