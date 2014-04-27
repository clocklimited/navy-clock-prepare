var path = require('path')
  , commandRunner = require('./lib/command-runner')
  , git = require('./lib/git')(commandRunner)
  , cloneOrUpdate = require('./lib/clone-or-update')(git)
  , compareCurrentTag = require('./lib/compare-current-tag')(git)
  , checkoutTag = require('./lib/checkout-tag')(git)
  , initSubmodules = require('./lib/init-submodules')(git)
  , runPrepare = require('./lib/run-prepare')(commandRunner)
  , prepareToBuild = require('./lib/prepare-to-build')()
  , runBuild = require('./lib/run-build')()
  , cleanBuild = require('./lib/clean-build')()
  , createExecuteCopyOrder = require('./lib/execute-copy-order')

module.exports = function clockPrepare(config) {

  var steps =
  { init: init
  , cloneOrUpdate: cloneOrUpdate
  , compareCurrentTag: compareCurrentTag
  , checkoutTag: checkoutTag
  , initSubmodules: initSubmodules
  , runPrepare: runPrepare
  , prepareToBuild: prepareToBuild
  , runBuild: runBuild
  , cleanBuild: cleanBuild
  , executeCopyOrder: createExecuteCopyOrder(config)
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
          , environment: context.environment
          , prepareDir: context.appData.prepareDir
          , buildDir: context.appData.buildDir
          }
      , dirName = context.appId + '-' + data.environment + '-' + data.appVersion
      , finalBuildDir = path.join(context.appData.buildDir, dirName)

    data.finalBuildDir = finalBuildDir
    callback(null, data)
  }

  return {
    getSteps: getSteps
  , getStepList: getStepList
  }

}
