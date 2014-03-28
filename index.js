var commandRunner = require('./lib/command-runner')
  , git = require('./lib/git')(commandRunner)
  , cloneOrUpdate = require('./lib/clone-or-update')(git)
  , compareCurrentTag = require('./lib/compare-current-tag')(git)
  , checkoutTag = require('./lib/checkout-tag')(git)
  , initSubmodules = require('./lib/init-submodules')(git)
  , runPrepare = require('./lib/run-prepare')(commandRunner)

module.exports = function clockPrepare() {

  var steps =
  { init: init
  , cloneOrUpdate: cloneOrUpdate
  , compareCurrentTag: compareCurrentTag
  , checkoutTag: checkoutTag
  , initSubmodules: initSubmodules
  , runPrepare: runPrepare
  }

  function getSteps() {
    return steps
  }

  function getStepList() {
    return Object.keys(steps)
  }

  function init(context, callback) {
    var data =
      { appVersion: context.orderArgs[0]
      , repository: context.appData.repository
      , prepareDir: context.appData.prepareDir
      }

    callback(null, data)
  }

  return {
    getSteps: getSteps
  , getStepList: getStepList
  }

}
