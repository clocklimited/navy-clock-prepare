module.exports = function createInitSubmodules(git) {

  function initSubmodules(context, data, callback) {
    if (data.canSkip) {
      return callback(null, data)
    }
    context.emit('Initialising submodules')
    git.submoduleInit(data.prepareDir
    , function (submoduleData) {
        context.emit(submoduleData)
      }
    , function (error) {
        callback(error, data)
      }
    )
  }

  return initSubmodules
}
