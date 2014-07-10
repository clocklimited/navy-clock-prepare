var assert = require('assert')
  , sinon = require('sinon')
  , should = require('should')
  , EventEmitter = require('events').EventEmitter
  , createTarBuild = require('../../lib/tar-build')

function Emitter() {
  EventEmitter.call(this)
}
Emitter.prototype = Object.create(EventEmitter.prototype)

describe('tar-build', function () {

  it('should tar up the build directory', function (done) {
    var finalizeSpy = sinon.spy()
      , bulkCalled = false

    Emitter.prototype.pipe = function (stream) { process.nextTick(function () { stream.end() }) }
    Emitter.prototype.finalize = finalizeSpy
    Emitter.prototype.bulk = function (options) {
      bulkCalled = true
      assert.equal(options[0].src, '**')
      assert.equal(options[0].dest, '')
      assert.equal(options[0].expand, true)
      assert.equal(options[0].cwd, '/tmp')
    }

    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data =
        { finalBuildDir: '/tmp'
        }
      , archiver = function (type) {
          type.should.equal('tar')
          return new Emitter()
        }
      , tarBuild = createTarBuild(archiver)

    tarBuild(context, data, function (error) {
      assert.equal(error, null)
      assert.equal(emitSpy.calledTwice, true, 'emit not called twice. Called: ' + emitSpy.callCount)
      assert.equal(bulkCalled, true, 'bulk not called')
      assert.equal(finalizeSpy.calledOnce, true, 'finalize not called once. Called: ' + finalizeSpy.callCount)
      assert(data.tarPath)
      done()
    })
  })

  it('should do nothing if isMaster is false', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: false }
      , data = {}
      , tarBuild = createTarBuild()

    tarBuild(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

})
