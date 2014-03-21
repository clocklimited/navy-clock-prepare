module.exports = function createRunPrepare(runCmd) {

  function runPrepare(context, data, callback) {
    var args = [ 'run-script', 'prepare' ]
      , options = { cwd: data.buildDir }

    runCmd('npm'
    , args
    , options
    , function (setupData) {
        context.emit(setupData)
      }
    , callback
    )
  }

  return runPrepare
}
