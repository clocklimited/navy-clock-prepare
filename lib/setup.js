var runCmd = require('./command-runner')

module.exports = function (context, data, callback) {
  var args = [ 'support/setup.sh' ]
    , options = { cwd: data.buildDir }

  runCmd('bash'
  , args
  , options
  , function (data) {
      context.emit(data)
    }
  , callback
  )
}
