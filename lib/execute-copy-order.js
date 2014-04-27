module.exports = function createExecuteCopyOrder(orderConfig) {

  function executeCopyOrder(context, data, callback) {
    context.emit('Issuing rsync order...')
    var reverseSshConnectionCommand = orderConfig.externalIpAddress + ':' + data.finalBuildDir
      , orderArgs = [ reverseSshConnectionCommand, data.buildDir ]

    context.executeOrder('rsync', orderArgs, function (response) {
      var error = null
      if (!response.success) {
        context.emit('rsync order execution failed: ' + response.message)
        error = new Error('Error executing rsync order: ' + response.message)
      }
      callback(error, data)
    })
  }

  return executeCopyOrder
}
