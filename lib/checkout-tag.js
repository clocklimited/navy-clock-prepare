module.exports = function createCheckoutTag(git) {

  function checkoutTag(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
    }
    if (data.canSkip || !context.isMaster) {
      return callback(null, data)
    }
    context.emit('Checking out tag: ' + data.appVersion)
    git.checkout(data.appVersion
    , data.prepareDir
    , function (checkoutData) {
        context.emit(checkoutData)
      }
    , function (error) {
        callback(error, data)
      }
    )
  }

  return checkoutTag
}
