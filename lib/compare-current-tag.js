var async = require('async')

module.exports = function createCompareCurrentTag(git) {

  function compareCurrentTag(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }
    context.emit('Comparing current hash with new hash...')
    async.parallel
    ( { currentHash: function (paraCallback) {
          var currentHash = null
          git.revParse(data.prepareDir
          , function (hash) {
              currentHash = hash
            }
          , function () {
              paraCallback(null, currentHash)
            }
          )
        }
      , newHash: function (paraCallback) {
          var newHash = null
          git.revParse(data.appVersion
          , data.prepareDir
          , function (hash) {
              newHash = hash
            }
          , function () {
              paraCallback(null, newHash)
            }
          )
        }
      }
    , function (error, results) {
        data.canSkip = results.currentHash === results.newHash
        if (data.canSkip) {
          context.emit('Hashes are equal, skipping remaining steps')
        } else {
          context.emit('Hashes are not equal, running remaining steps')
        }
        callback(null, data)
      }
    )
  }

  return compareCurrentTag
}
