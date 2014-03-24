var sinon = require('sinon')
  , should = require('should')
  , createRunPrepare = require('../../lib/run-prepare')

describe('run-setup', function () {

  it('should emit data when running prepare', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy }
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
      emitSpy.calledOnce.should.equal(true)
      done()
    })
  })

})
