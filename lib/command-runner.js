var cp = require('child_process')

module.exports = function runCmd(cmd, args, options, onData, callback) {
  var childProcess = cp.spawn(cmd, args, options)

  function onDataWrapper(data) {
    onData(data.toString())
  }

  childProcess.stdout.on('data', onDataWrapper)
  childProcess.stderr.on('data', onDataWrapper)
  childProcess.on('close', function (exitCode) {
    var error = null
    if (exitCode > 0) {
      error = new Error('An error occured, see last output')
    }
    callback(error)
  })
}
