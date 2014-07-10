var rmdir = require('rmdir')
  , path = require('path')

module.exports = function createCleanBuild() {

  function cleanBuild(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }
    context.emit('Cleaning build directory..')
    rmdir(path.join(data.finalBuildDir, '.git'), function (error) {
      callback(error, data)
    })
  }

  return cleanBuild
}
