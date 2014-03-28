module.exports = function createCheckoutTag(git) {

  function checkoutTag(context, data, callback) {
    if (data.canSkip) {
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
