var fs = require('fs')

module.exports = function createTarBuild(archiver) {

  function tarBuild(context, data, callback) {
    var archive = archiver('tar')
      , filePath = '/tmp/' + Math.round(Math.random() * 1000000).toString(8) + '.tar'
      , fileStream = fs.createWriteStream(filePath)

    fileStream.on('finish', function () {
      context.emit('Tarring complete')
      data.tarPath = filePath
      callback(null, data)
    })

    archive.pipe(fileStream)

    context.emit('Tarring contents of: ' + data.finalBuildDir + ' to: ' + filePath)

    archive.bulk([
      { src: [ '**' ], dest: '', expand: true, cwd: data.finalBuildDir }
    ])

    archive.finalize()
  }

  return tarBuild
}
