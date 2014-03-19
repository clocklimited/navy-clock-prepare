var sinon = require('sinon')
  , should = require('should')
  , createRunSetup = require('../../lib/run-setup')
  , runCmd = function(cmd, args, options, onData, callback) {
      onData()
      callback()
    }

describe('run-setup', function () {

  it('should emit data when running setup', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy }
      , runSetup = createRunSetup(runCmd)

    runSetup(context, {}, function (error) {
      should.not.exist(error)
      emitSpy.calledOnce.should.equal(true)
      done()
    })
  })

})
