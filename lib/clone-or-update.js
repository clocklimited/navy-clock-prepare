var fs = require('fs')

module.exports = function createCloneOrUpdate(git) {

  function cloneOrUpdate(context, data, callback) {
    fs.exists(data.buildDir, function (exists) {
      if (exists) {
        update(context, data, callback)
      } else {
        clone(context, data, callback)
      }
    })
  }

  function update(context, data, callback) {
    context.emit('Updating ' + data.buildDir + ' from ' + data.repository)
    git.fetch(data.buildDir
    , function (fetchData) {
        context.emit(fetchData)
      }
    , function (error) {
        callback(error, data)
      }
    )
  }

  function clone(context, data, callback) {
    context.emit('Cloning ' + data.repository + ' to ' + data.buildDir)
    git.clone(data.repository
    , data.buildDir
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
