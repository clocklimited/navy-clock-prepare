module.exports = function createInitSubmodules(git) {

  function initSubmodules(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
    }
    if (data.canSkip || !context.isMaster) {
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
