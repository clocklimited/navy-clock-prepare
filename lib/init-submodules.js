var git = require('./git')()

module.exports = function checkoutTag(context, data, callback) {
  context.emit('Initialising submodules')
  git.submoduleInit(data.buildDir
  , function (data) {
      context.emit(data)
    }
  , function (error) {
      callback(error, data)
    }
  )
}
