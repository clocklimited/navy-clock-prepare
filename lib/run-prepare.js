module.exports = function createRunPrepare(runCmd) {

  function runPrepare(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
    }
    if (data.canSkip || !context.isMaster) {
      return callback(null, data)
    }
    context.emit('Running prepare script...')
    var args = [ 'run-script', 'prepare' ]
      , options = { cwd: data.prepareDir }

    runCmd('npm'
    , args
    , options
    , function (setupData) {
        context.emit(setupData)
      }
    , function (error) {
        callback(error, data)
      }
    )
  }

  return runPrepare
}
