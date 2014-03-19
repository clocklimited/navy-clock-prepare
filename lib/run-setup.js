module.exports = function createRunSetup(runCmd) {

  function runSetup(context, data, callback) {
    var args = [ 'support/setup.sh' ]
      , options = { cwd: data.buildDir }

    runCmd('bash'
    , args
    , options
    , function (setupData) {
        context.emit(setupData)
      }
    , callback
    )
  }

  return runSetup
}
