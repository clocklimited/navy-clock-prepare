var fs = require('fs')

module.exports = function createRemoveBuildTar() {

  function removeBuildTar(context, data, callback) {
    context.emit('Removing tar file...')
    fs.unlink(data.tarPath, function (error) {
      callback(error, data)
    })
  }

  return removeBuildTar
}
