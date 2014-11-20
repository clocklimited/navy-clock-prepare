var assert = require('assert')
  , request = require('supertest')
  , sinon = require('sinon')
  , should = require('should')
  , rewire = require('rewire')
  , createServeBuild = rewire('../../lib/serve-build')

describe('serve-build', function () {

  function createExecuteOrder(isSuccessful) {
    return function executeOrder(order, orderArgs, callback) {
      assert.equal(order, 'requestBuild')
      assert.equal(orderArgs.length, 3)
      var regEx = new RegExp('^http://127\\.0\\.0\\.1:2020/null$')
      assert.equal(regEx.test(orderArgs[0]), true, 'order argument is incorrect')
      assert.equal(orderArgs[1], '/tmp')
      assert.equal(orderArgs[2], 'abc123')

      var urlParts = orderArgs[0].split('/')
        , path = urlParts[urlParts.length - 1]
        , domain = orderArgs[0].replace('/' + path, '')

      request(domain)
        .get('/' + path)
        .expect(200, function () {
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
      , context = { emit: emitSpy, executeOrder: createExecuteOrder(true), isMaster: true }
      , data =
        { tarPath: '/dev/null'
        , finalBuildDir: '/tmp'
        , tarPassphrase: 'abc123'
        }
      , createReadStreamCalled = false
      , mockFs =
        { createReadStream: function (filePath) {
            createReadStreamCalled = true
            assert.equal(filePath, data.tarPath)
            var stream =
            { pipe: function (res) {
                res.send(200)
              }
            }
            return stream
          }
        }

    createServeBuild.__set__('fs', mockFs)

    var serveBuild = createServeBuild({ externalHost: '127.0.0.1', tarServerPort: 2020 })

    serveBuild(context, data, function (error, data) {
      assert.equal(error, null)
      assert.equal(createReadStreamCalled, true)
      assert(data, 'data should exist')
      assert.equal(emitSpy.calledOnce, true, 'emit not called once. Called: ' + emitSpy.callCount)
      done()
    })
  })

  it('should serve the build via a http server with errors', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, executeOrder: createExecuteOrder(false), isMaster: true }
      , data =
        { tarPath: '/dev/null'
        , finalBuildDir: '/tmp'
        , tarPassphrase: 'abc123'
        }
      , serveBuild = createServeBuild({ externalHost: '127.0.0.1', tarServerPort: 2020 })

    serveBuild(context, data, function (error, data) {
      assert.equal(error.message, 'Error executing request build order: error')
      assert(data, 'data should exist')
      assert.equal(emitSpy.calledTwice, true, 'emit not called twice. Called: ' + emitSpy.callCount)
      done()
    })
  })

  it('should do nothing if isMaster is false', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: false }
      , data = {}
      , serveBuild = createServeBuild()

    serveBuild(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

})
