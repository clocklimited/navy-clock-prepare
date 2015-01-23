var fork = require('child_process').fork

module.exports = function createServeBuild(orderConfig) {

  function serveBuild(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }
    var tarPathParts = data.tarPath.split('/')
      , fileName = tarPathParts[tarPathParts.length - 1]
      , child = fork('http-server.js', [ orderConfig.tarServerPort, data.tarPath ], { cwd: __dirname })
      , requestUrl = 'http://' + orderConfig.externalHost + ':' + orderConfig.tarServerPort + '/' + fileName
      , orderArgs = [ requestUrl, data.finalBuildDir, data.tarPassphrase ]

    child.on('error', function (error) {
      context.emit('serving build failed. http server failed to start')
      callback(error, data)
    })

    child.on('exit', function (code) {
      if (code > 0) {
        context.emit('serving build failed. http server exited with code: ' + code)
        var error = new Error('Error executing serve build order. http server exited with code: ' + code)
        return callback(error, data)
      }
    })

    child.on('message', function (msg) {
      if (msg.ready) {
        context.emit('ready to serve build')
        context.executeOrder('requestBuild', orderArgs, function (response) {
          child.send({ close: true })
          var error = null
          if (!response.success) {
            context.emit('request build order execution failed: ' + response.message)
            error = new Error('Error executing request build order: ' + response.message)
          }
          callback(error, data)
        })
      }
    })

  }

  return serveBuild
}
