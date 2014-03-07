var cloneOrUpdate = require('./lib/clone-or-update')
  , checkoutTag = require('./lib/checkout-tag')
  , initSubmodules = require('./lib/init-submodules')
  , setup = require('./lib/setup')

module.exports = function clockBuild() {

  var steps =
  { init: init
  , cloneOrUpdate: cloneOrUpdate
  , checkoutTag: checkoutTag
  , initSubmodules: initSubmodules
  , setup: setup
  }

  function getSteps() {
    return steps
  }

  function getStepList() {
    return Object.keys(steps)
  }

  function init(context, callback) {
    var data =
      { environment: context.orderArgs[0]
      , appVersion: context.orderArgs[1]
      }

    // These will come from context.appData
    data.repository = 'PUT NUD GIT REPO HERE'
    data.buildDir = '/tmp/navy-test-build/'

    callback(null, data)
  }

  return {
    getSteps: getSteps
  , getStepList: getStepList
  }

}
