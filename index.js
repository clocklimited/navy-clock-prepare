var path = require('path')
  , hat = require('hat')
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
  , tarBuild = require('./lib/tar-build')(hat)
  , createServeBuild = require('./lib/serve-build')
  , removeBuildTar = require('./lib/remove-build-tar')()

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
  , tarBuild: tarBuild
  , serveBuild: createServeBuild(config)
  , removeBuildTar: removeBuildTar
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
          , repository: context.appData.repository
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
