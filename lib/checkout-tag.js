module.exports = function createCheckoutTag(git) {

  function checkoutTag(context, data, callback) {
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
