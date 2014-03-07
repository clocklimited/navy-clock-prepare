var cp = require('child_process')

module.exports = function runCmd(cmd, args, options, onData, callback) {
  var process = cp.spawn(cmd, args, options)

  function onDataWrapper(data) {
    onData(data.toString())
  }

  process.stdout.on('data', onDataWrapper)
  process.stderr.on('data', onDataWrapper)
  process.on('close', function (exitCode) {
    if (exitCode > 0) {
      callback(new Error('An error occured, see last output'))
    } else {
      callback(null)
    }
  })
}
