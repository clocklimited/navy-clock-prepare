var should = require('should')
  , sinon = require('sinon')
  , rewire = require('rewire')
  , createRunBuild = rewire('../../lib/run-build')
  , EventEmitter = require('events').EventEmitter

function Emitter() {
  EventEmitter.call(this)
}
Emitter.prototype = Object.create(EventEmitter.prototype)

function createChildProcess() {
  var childProcess = new Emitter()
  childProcess.stdout = new Emitter()
  childProcess.stderr = new Emitter()
  return childProcess
}

describe('run-build', function () {

  it('should execute a successful build command', function (done) {

    var childProcess = createChildProcess()
      , data = { environment: 'staging', finalBuildDir: '/tmp/build' }

    /* jshint camelcase: false */
    createRunBuild.__set__('cp', {
      spawn: function (cmd, args, options) {
        cmd.should.equal('npm')
        args.length.should.equal(2)
        args[0].should.equal('run-script')
        args[1].should.equal('build')
        Object.keys(options).length.should.equal(2)
        options.cwd.should.equal(data.finalBuildDir)
        options.env.NODE_ENV.should.equal(data.environment)
        return childProcess
      }
    })

    var runBuild = createRunBuild()
      , emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }

    runBuild(context, data, function (error) {
      should.not.exist(error)
      emitSpy.calledThrice.should.equal(true, 'emit called thrice')
      emitSpy.calledWith('stdoutData').should.equal(true, 'emit called with expected value')
      emitSpy.calledWith('stderrData').should.equal(true, 'emit called with expected value')
      done()
    })

    childProcess.stdout.emit('data', 'stdoutData')
    childProcess.stderr.emit('data', 'stderrData')
    childProcess.emit('close', 0)

  })

  it('should executed a failed build command', function (done) {

    var childProcess = createChildProcess()

    /* jshint camelcase: false */
    createRunBuild.__set__('cp', {
      spawn: function () {
        return childProcess
      }
    })

    var runBuild = createRunBuild()
      , emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }

    runBuild(context, {}, function (error) {
      should.exist(error)
      done()
    })

    childProcess.emit('close', 1)

  })

  it('should do nothing if isMaster is false', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: false }
      , data = {}
      , runBuild = createRunBuild()

    runBuild(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

})
