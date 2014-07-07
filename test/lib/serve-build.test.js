var assert = require('assert')
  , request = require('supertest')
  , sinon = require('sinon')
  , createServeBuild = require('../../lib/serve-build')

describe('serve-build', function () {

  function createExecuteOrder(isSuccessful) {
    return function executeOrder(order, orderArgs, callback) {
      assert.equal(order, 'requestBuild')
      assert.equal(orderArgs.length, 2)
      var regEx = new RegExp('^http://127\\.0\\.0\\.1:.*/null$')
      assert.equal(regEx.test(orderArgs[0]), true, 'order argument is incorrect')
      assert.equal(orderArgs[1], '/tmp')

      var urlParts = orderArgs[0].split('/')
        , path = urlParts[urlParts.length - 1]
        , domain = orderArgs[0].replace('/' + path, '')

      request(domain)
        .get('/' + path)
        .expect(200)
        .end(function () {
          if (isSuccessful) {
            callback({ success: true })
          } else {
            callback({ success: false, message: 'error' })
          }
        })
    }
  }

  it('should serve the build via a http server with no errors', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, executeOrder: createExecuteOrder(true) }
      , data =
        { tarPath: '/dev/null'
        , finalBuildDir: '/tmp'
        }
      , serveBuild = createServeBuild({ externalHost: '127.0.0.1' })

    serveBuild(context, data, function (error, data) {
      assert.equal(error, null)
      assert(data, 'data should exist')
      assert.equal(emitSpy.calledOnce, true, 'emit not called once. Called: ' + emitSpy.callCount)
      done()
    })
  })

  it('should serve the build via a http server with errors', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, executeOrder: createExecuteOrder(false) }
      , data =
        { tarPath: '/dev/null'
        , finalBuildDir: '/tmp'
        }
      , serveBuild = createServeBuild({ externalHost: '127.0.0.1' })

    serveBuild(context, data, function (error, data) {
      assert.equal(error.message, 'Error executing request build order: error')
      assert(data, 'data should exist')
      assert.equal(emitSpy.calledTwice, true, 'emit not called twice. Called: ' + emitSpy.callCount)
      done()
    })
  })

})
