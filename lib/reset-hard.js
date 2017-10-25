module.exports = function createResetHard(git) {

  function resetHard(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
    }
    if (data.canSkip || !context.isMaster) {
      return callback(null, data)
    }
    context.emit('Doing hard reset...')
    git.resetHard(data.prepareDir
    , function (checkoutData) {
        context.emit(checkoutData)
      }
    , function (error) {
        callback(error, data)
      }
    )
  }

  return resetHard
}
