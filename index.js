var commandRunner = require('./lib/command-runner')
  , git = require('./lib/git')(commandRunner)
  , cloneOrUpdate = require('./lib/clone-or-update')(git)
  , checkoutTag = require('./lib/checkout-tag')(git)
  , initSubmodules = require('./lib/init-submodules')(git)
  , runPrepare = require('./lib/run-prepare')(commandRunner)

module.exports = function clockBuild() {

  var steps =
  { init: init
  , cloneOrUpdate: cloneOrUpdate
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
      { environment: context.orderArgs[0]
      , appVersion: context.orderArgs[1]
      , repository: context.appData.repository
      , buildDir: context.appData.buildDir
      }

    callback(null, data)
  }

  return {
    getSteps: getSteps
  , getStepList: getStepList
  }

}
