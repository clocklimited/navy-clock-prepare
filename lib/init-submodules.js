module.exports = function createInitSubmodules(git) {

  function initSubmodules(context, data, callback) {
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
