var sinon = require('sinon')
  , should = require('should')
  , createInitSubmodules = require('../../lib/init-submodules')
  , git =
    { submoduleInit: function(prepareDir, onData, callback) {
        onData()
        callback()
      }
    }

describe('init-submodules', function () {

  it('should emit data on submodule init', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data = { prepareDir: '/tmp' }
      , initSubmodules = createInitSubmodules(git)

    initSubmodules(context, data, function (error, newData) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true)
      newData.prepareDir.should.equal('/tmp')
      done()
    })
  })

  it('should do nothing if canSkip is true', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data = { canSkip: true }
      , initSubmodules = createInitSubmodules(git)

    initSubmodules(context, data, function (error, newData) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(0)
      newData.canSkip.should.equal(true, 'can skip value incorrect')
      done()
    })
  })

  it('should do nothing if isMaster is false', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: false }
      , data = {}
      , initSubmodules = createInitSubmodules(git)

    initSubmodules(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

})
