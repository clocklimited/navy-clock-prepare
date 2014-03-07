var fs = require('fs')
  , git = require('./git')()

module.exports = function cloneOrUpdate(context, data, callback) {
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
  , function (data) {
      context.emit(data)
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
  , function (data) {
      context.emit(data)
    }
  , function (error) {
      callback(error, data)
    }
  )
}
