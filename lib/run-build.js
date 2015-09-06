var cp = require('child_process')
  , extend = require('extend')

module.exports = function createRunBuild() {

  function runBuild(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }
    context.emit('Running build script...')

    var envVars = extend({}, process.env, data.customEnvVars)
    envVars.NODE_ENV = data.environment

    var args = [ 'run-script', 'build' ]
      , options = { cwd: data.finalBuildDir, env: envVars }
      , childProcess = cp.spawn('npm', args, options)

    function onDataWrapper(buildData) {
      context.emit(buildData.toString())
    }

    childProcess.stdout.on('data', onDataWrapper)
    childProcess.stderr.on('data', onDataWrapper)
    childProcess.on('close', function (exitCode) {
      var error = null
      if (exitCode > 0) {
        error = new Error('An error occured, see last output')
      }
      callback(error, data)
    })
  }

  return runBuild
}
