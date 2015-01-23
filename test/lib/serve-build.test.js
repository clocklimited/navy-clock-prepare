var assert = require('assert')
  , request = require('supertest')
  , sinon = require('sinon')
  , should = require('should')
  , rewire = require('rewire')
  , path = require('path')
  , createServeBuild = rewire('../../lib/serve-build')
  , EventEmitter = require('events').EventEmitter

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
      , mockForkedProcess = new EventEmitter()
      , sendSpy = sinon.spy()

    function createFork(fileName, params, options) {
      assert.equal(fileName, 'http-server.js')
      assert.equal(params[0], 2020)
      assert.equal(params[1], '/dev/null')
      assert.equal(options.cwd, path.resolve(__dirname + '/../../lib'))
      return mockForkedProcess
    }

    mockForkedProcess.send = sendSpy
    createServeBuild.__set__({ fork: createFork })

    var serveBuild = createServeBuild({ externalHost: '127.0.0.1', tarServerPort: 2020 })

    serveBuild(context, data, function (error, data) {
      assert.equal(error, null)
      assert(data, 'data should exist')
      assert.equal(emitSpy.calledOnce, true, 'emit not called once. Called: ' + emitSpy.callCount)
      assert.equal(sendSpy.calledWithExactly({ close: true })
        , true, 'send not called once. Called: ' + sendSpy.callCount)
      done()
    })

    mockForkedProcess.emit('message', { ready: true })
    mockForkedProcess.emit('exit', 0)
  })

  it('should serve the build via a http server with errors', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, executeOrder: createExecuteOrder(false), isMaster: true }
      , data =
          { tarPath: '/dev/null'
          , finalBuildDir: '/tmp'
          , tarPassphrase: 'abc123'
          }
      , mockForkedProcess = new EventEmitter()
      , sendSpy = sinon.spy()

    mockForkedProcess.send = sendSpy
    createServeBuild.__set__({ fork: function () { return mockForkedProcess } })

    var serveBuild = createServeBuild({ externalHost: '127.0.0.1', tarServerPort: 2020 })

    serveBuild(context, data, function (error, data) {
      assert.equal(error.message, 'Error executing request build order: error')
      assert(data, 'data should exist')
      assert.equal(emitSpy.calledTwice, true, 'emit not called twice. Called: ' + emitSpy.callCount)
      assert.equal(sendSpy.calledWithExactly({ close: true })
        , true, 'send not called once. Called: ' + sendSpy.callCount)
      done()
    })

    mockForkedProcess.emit('message', { ready: true })
  })

  it('should return with errors if http server cannot start', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, executeOrder: createExecuteOrder(false), isMaster: true }
      , data =
          { tarPath: '/dev/null'
          , finalBuildDir: '/tmp'
          , tarPassphrase: 'abc123'
          }
      , mockForkedProcess = new EventEmitter()

    createServeBuild.__set__({ fork: function () { return mockForkedProcess } })

    var serveBuild = createServeBuild({ externalHost: '127.0.0.1' })

    serveBuild(context, data, function (error, data) {
      assert.equal(error.message, 'error starting process')
      assert(data, 'data should exist')
      assert.equal(emitSpy.calledOnce, true, 'emit not called once. Called: ' + emitSpy.callCount)
      done()
    })

    mockForkedProcess.emit('error', new Error('error starting process'))
  })

  it('should return with errors if http server exits with code > 0', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, executeOrder: createExecuteOrder(false), isMaster: true }
      , data =
          { tarPath: '/dev/null'
          , finalBuildDir: '/tmp'
          , tarPassphrase: 'abc123'
          }
      , mockForkedProcess = new EventEmitter()

    createServeBuild.__set__({ fork: function () { return mockForkedProcess } })

    var serveBuild = createServeBuild({ externalHost: '127.0.0.1' })

    serveBuild(context, data, function (error, data) {
      assert.equal(error.message, 'Error executing serve build order. http server exited with code: 1')
      assert(data, 'data should exist')
      assert.equal(emitSpy.calledOnce, true, 'emit not called once. Called: ' + emitSpy.callCount)
      done()
    })

    mockForkedProcess.emit('message', false)
    mockForkedProcess.emit('exit', 1)
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
