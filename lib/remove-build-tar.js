var fs = require('fs')

module.exports = function createRemoveBuildTar() {

  function removeBuildTar(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }
    context.emit('Removing tar file...')
    fs.unlink(data.tarPath, function (error) {
      callback(error, data)
    })
  }

  return removeBuildTar
}
