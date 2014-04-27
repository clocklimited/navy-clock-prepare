var ncp = require('ncp')
  , copy = ncp.ncp

module.exports = function createPrepareToBuild() {

  function prepareToBuild(context, data, callback) {
    context.emit('Copying prepare directory to build directory')
    context.emit('cp -r ' + data.prepareDir + ' ' + data.finalBuildDir)
    copy(data.prepareDir, data.finalBuildDir, function (error) {
      callback(error, data)
    })
  }

  return prepareToBuild
}
