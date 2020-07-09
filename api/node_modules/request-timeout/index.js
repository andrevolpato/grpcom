/**
 * configureable request timeout
 */

module.exports = timeout

var responseEnd = require('response-end')

function timeout(req, res, seconds) {
  responseEnd(res)

  var len = (seconds || 20) * 1000
  var timer = false

  function clear() {
    clearTimeout(timer)
    timer = false
  }

  function start(len) {
    if (timer) return
    len = req.timeout.length = len || req.timeout.length
    timer = setTimeout(expire, len)
  }

  function reset(len) {
    clear()
    start(len)
  }

  function expire() {
    req.emit('timeout', req, res)
    clear()
  }

  req.timeout = {
    length: len,
    timer: timer,
    start: start,
    clear: clear,
    reset: reset,
    expire: expire
  }

  start()
  res.on('end', clear)
}