var assert = require('assert')
  , sinon = require('sinon')
  , EventEmitter = require('events').EventEmitter
  , rewire = require('rewire')
  , createTarBuild = rewire('../../lib/tar-build')

function Emitter() {
  EventEmitter.call(this)
}
Emitter.prototype = Object.create(EventEmitter.prototype)

describe('tar-build', function () {

  it('should tar up and encrypt the build directory', function (done) {
    var finalizeSpy = sinon.spy()
      , bulkCalled = false
      , emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data =
        { finalBuildDir: '/tmp'
        }
      , archiver = function (type) {
          assert.equal(type, 'tar')
          var emitter = new Emitter()
          emitter.finalize = finalizeSpy
          emitter.pipe = function (stream) {
            assert.equal(stream.type, 'gpg.stdin')
            return stream
          }
          emitter.bulk = function (options) {
            bulkCalled = true
            assert.equal(options[0].src, '**')
            assert.equal(options[0].dest, '')
            assert.equal(options[0].expand, true)
            assert.equal(options[0].cwd, '/tmp')
          }
          return emitter
        }
      , mockSpawnCalled = false
      , mockFs =
        { createWriteStream: function (filePath) {
            assert(filePath.indexOf('.tar.pgp') > -1)
            var emitter = new Emitter()
            emitter.type = 'filestream'
            return emitter
          }
        }

    function mockSpawn(cmd, options) {
      mockSpawnCalled = true
      assert.equal(cmd, 'gpg')
      assert.equal(options.length, 3)
      assert.equal(options[0], '-c')
      assert.equal(options[1], '--passphrase')
      assert.equal(options[2], 'abc123')
      var spawn =
      { stdin:
        { type: 'gpg.stdin'
        , pipe: function (stream) {
            assert.equal(stream.type, 'gpg.stdout')
            return stream
          }
        }
      , stdout:
        { type: 'gpg.stdout'
        , pipe: function (stream) {
            assert.equal(stream.type, 'filestream')
            process.nextTick(function () { stream.emit('finish') })
          }
        }
      }
      return spawn
    }

    createTarBuild.__set__('fs', mockFs)
    createTarBuild.__set__('spawn', mockSpawn)

    var tarBuild = createTarBuild(archiver, function () { return 'abc123' })

    tarBuild(context, data, function (error) {
      assert.equal(error, null)
      assert.equal(mockSpawnCalled, true)
      assert.equal(emitSpy.calledTwice, true, 'emit not called twice. Called: ' + emitSpy.callCount)
      assert.equal(bulkCalled, true, 'bulk not called')
      assert.equal(finalizeSpy.calledOnce, true, 'finalize not called once. Called: ' + finalizeSpy.callCount)
      assert(data.tarPath)
      assert.equal(data.tarPassphrase, 'abc123')
      done()
    })
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
