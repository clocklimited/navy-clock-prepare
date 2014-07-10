var fs = require('fs')

module.exports = function createCloneOrUpdate(git) {

  function cloneOrUpdate(context, data, callback) {
    if (!context.isMaster) {
      context.emit('Not the master captain. Skipping step')
      return callback(null, data)
    }
    fs.exists(data.prepareDir, function (exists) {
      if (exists) {
        update(context, data, callback)
      } else {
        clone(context, data, callback)
      }
    })
  }

  function update(context, data, callback) {
    context.emit('Updating ' + data.prepareDir + ' from ' + data.repository)
    git.fetch(data.prepareDir
    , function (fetchData) {
        context.emit(fetchData)
      }
    , function (error) {
        callback(error, data)
      }
    )
  }

  function clone(context, data, callback) {
    context.emit('Cloning ' + data.repository + ' to ' + data.prepareDir)
    git.clone(data.repository
    , data.prepareDir
    , function (cloneData) {
        context.emit(cloneData)
      }
    , function (error) {
        callback(error, data)
      }
    )
  }

  return cloneOrUpdate
}
