var exec = require('child_process').exec

module.exports = function createTarBuild(generatePassphrase) {

  function tarBuild(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }

    var filePath = '/tmp/' + Math.round(Math.random() * 1000000).toString(8) + '.tar.zst.gpg'
      , passphrase = generatePassphrase()

    context.emit('Tarring contents of: ' + data.finalBuildDir + ' to: ' + filePath)
    var cmd = 'tar cI "zstd -T4" . | ' +
      'gpg --compress-level 0 --batch --symmetric --passphrase ' + passphrase + ' --output ' + filePath
    exec(cmd, { cwd: data.finalBuildDir }, function (error) {
      if (error) {
        return callback(error, data)
      }
      context.emit('Tarring complete')
      data.tarPath = filePath
      data.tarPassphrase = passphrase
      callback(null, data)
    })

  }

  return tarBuild
}
