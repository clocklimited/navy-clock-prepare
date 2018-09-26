var assert = require('assert')
  , sinon = require('sinon')
  , rewire = require('rewire')
  , createTarBuild = rewire('../../lib/tar-build')

describe('tar-build', function () {

  function runTest(shouldError, done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data =
        { finalBuildDir: '/tmp'
        }
      , mockExecCalled = false

    function mockExec(cmd, options, callback) {
      mockExecCalled = true
      var cmdIndex = cmd.indexOf('tar cI "zstd -T4" . | ' +
        'gpg --compress-level 0 --batch --symmetric --passphrase abc123 --output /tmp/')
      assert.equal(cmdIndex, 0, 'command is invalid')
      assert.equal(options.cwd, data.finalBuildDir)
      if (shouldError) {
        callback(new Error())
      } else {
        callback()
      }
    }

    createTarBuild.__set__('exec', mockExec)

    var tarBuild = createTarBuild(function () { return 'abc123' })

    tarBuild(context, data, function (error) {
      var expectedEmitCallCount = 2
      if (shouldError) {
        assert(error, 'error should exist')
        expectedEmitCallCount = 1
      } else {
        assert.equal(error, null)
        assert(data.tarPath)
        assert.equal(data.tarPassphrase, 'abc123')
      }
      assert.equal(mockExecCalled, true)
      assert.equal(emitSpy.callCount, expectedEmitCallCount)
      done()
    })
  }

  it('should tar up and encrypt the build directory with no errors', function (done) {
    runTest(false, done)
  })

  it('should tar up and encrypt the build directory with errors', function (done) {
    runTest(true, done)
  })

  it('should do nothing if isMaster is false', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: false }
      , data = {}
      , tarBuild = createTarBuild()

    tarBuild(context, data, function (error) {
      assert.equal(error, null)
      assert.equal(emitSpy.callCount, 1)
      assert.equal(emitSpy.calledWith('Not the master captain. Skipping step'), true)
      done()
    })
  })

})
