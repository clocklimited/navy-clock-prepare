var should = require('should')
  , sinon = require('sinon')
  , rewire = require('rewire')
  , runCmd = rewire('../../lib/command-runner')
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

describe('command-runner', function () {

  it('should run a successful command with data events on stdout and stderr', function (done) {

    var childProcess = createChildProcess()

    /* jshint camelcase: false */
    runCmd.__set__('cp', {
      spawn: function () {
        return childProcess
      }
    })

    var onData = sinon.spy()

    runCmd('ls', [], {}, onData, function (error) {
      should.not.exist(error)
      onData.calledTwice.should.equal(true)
      onData.calledWith('stdoutData').should.equal(true)
      onData.calledWith('stderrData').should.equal(true)
      done()
    })

    childProcess.stdout.emit('data', 'stdoutData')
    childProcess.stderr.emit('data', 'stderrData')
    childProcess.emit('close', 0)

  })

  it('should run a failed command', function (done) {

    var childProcess = createChildProcess()

    /* jshint camelcase: false */
    runCmd.__set__('cp', {
      spawn: function () {
        return childProcess
      }
    })

    runCmd('ls', [], {}, null, function (error) {
      should.exist(error)
      done()
    })

    childProcess.emit('close', 1)

  })

})
