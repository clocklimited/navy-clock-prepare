var sinon = require('sinon')
  , should = require('should')
  , createRunPrepare = require('../../lib/run-prepare')

describe('run-setup', function () {

  it('should emit data when running prepare', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , runCmd = function(cmd, args, options, onData, callback) {
          cmd.should.equal('npm')
          args.length.should.equal(2)
          args[0].should.equal('run-script')
          args[1].should.equal('prepare')
          Object.keys(options).length.should.equal(1)
          options.cwd.should.equal('/tmp')
          onData()
          callback()
        }
      , runPrepare = createRunPrepare(runCmd)

    runPrepare(context, { prepareDir: '/tmp' }, function (error) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true, 'emit called count incorrect')
      done()
    })
  })

  it('should do nothing if canSkip is true', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data = { canSkip: true }
      , runPrepare = createRunPrepare()

    runPrepare(context, data, function (error, newData) {
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
      , runPrepare = createRunPrepare()

    runPrepare(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

})
