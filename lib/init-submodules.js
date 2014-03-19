module.exports = function createInitSubmodules(git) {

  function initSubmodules(context, data, callback) {
    context.emit('Initialising submodules')
    git.submoduleInit(data.buildDir
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
