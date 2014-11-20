var fs = require('fs')
  , spawn = require('child_process').spawn

module.exports = function createTarBuild(archiver, generatePassphrase) {

  function tarBuild(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }
    var archive = archiver('tar')
      , filePath = '/tmp/' + Math.round(Math.random() * 1000000).toString(8) + '.tar.pgp'
      , fileStream = fs.createWriteStream(filePath)
      , passphrase = generatePassphrase()
      , gpg = spawn('gpg', [ '-c', '--passphrase', passphrase ])

    fileStream.on('finish', function () {
      context.emit('Tarring complete')
      data.tarPath = filePath
      data.tarPassphrase = passphrase
      callback(null, data)
    })

    archive.pipe(gpg.stdin).pipe(gpg.stdout).pipe(fileStream)

    context.emit('Tarring contents of: ' + data.finalBuildDir + ' to: ' + filePath)

    archive.bulk([
      { src: [ '**' ], dest: '', expand: true, cwd: data.finalBuildDir }
    ])

    archive.finalize()
  }

  return tarBuild
}
