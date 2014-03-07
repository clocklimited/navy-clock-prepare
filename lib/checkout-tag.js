var git = require('./git')()

module.exports = function checkoutTag(context, data, callback) {
  context.emit('Checking out tag: ' + data.appVersion)
  git.checkout(data.appVersion
  , data.buildDir
  , function (data) {
      context.emit(data)
    }
  , function (error) {
      callback(error, data)
    }
  )
}
