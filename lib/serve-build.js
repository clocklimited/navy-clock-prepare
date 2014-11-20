var express = require('express')
  , http = require('http')
  , fs = require('fs')

module.exports = function createServeBuild(orderConfig) {

  function serveBuild(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }
    var tarPathParts = data.tarPath.split('/')
      , fileName = tarPathParts[tarPathParts.length - 1]
      , app = express()

    app.get('/' + fileName, function(req, res) {
      context.emit('Serving build...')
      var fileStream = fs.createReadStream(data.tarPath)
      fileStream.pipe(res)
    })

    var server = http.createServer(app).listen(orderConfig.tarServerPort)
    app.set('port', server.address().port)

    var requestUrl = 'http://' + orderConfig.externalHost + ':' + server.address().port + '/' + fileName
      , orderArgs = [ requestUrl, data.finalBuildDir, data.tarPassphrase ]

    context.executeOrder('requestBuild', orderArgs, function (response) {
      server.close()
      var error = null
      if (!response.success) {
        context.emit('request build order execution failed: ' + response.message)
        error = new Error('Error executing request build order: ' + response.message)
      }
      callback(error, data)
    })
  }

  return serveBuild
}
