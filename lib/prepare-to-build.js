var ncp = require('ncp')
  , copy = ncp.ncp

module.exports = function createPrepareToBuild() {

  function prepareToBuild(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }
    context.emit('Copying prepare directory to build directory')
    context.emit('cp -r ' + data.prepareDir + ' ' + data.finalBuildDir)
    copy(data.prepareDir, data.finalBuildDir, { limit: 256 }, function (error) {
      callback(error, data)
    })
  }

  return prepareToBuild
}
