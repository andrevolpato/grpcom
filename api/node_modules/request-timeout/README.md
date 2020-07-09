request-timeout
===============

Http request timeout for Node

### Installation

    npm install request-timeout

### Usage

    var timeout = require('request-timeout')
    var http = require('http')

    var server = http.createServer(handleRequest)

    function handleRequest(req, res) {
      timeout(req, res, 60) // set timeout to 60 seconds (default is 20)

      req.on('timeout', function() {
        console.log('The request timed out')
        res.end('The request timed out')
      })
    }

    server.listen(1137)
