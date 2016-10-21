var sinon = require('sinon')
  , should = require('should')
  , async = require('async')
  , fs = require('fs')
  , rmdir = require('rmdir')
  , prepareToBuild = require('../../lib/prepare-to-build')()

describe('prepare-to-build', function () {

  before(function () {
    fs.mkdirSync('/tmp/navy-clock-build-test')
    fs.mkdirSync('/tmp/navy-clock-build')
    const payload = Array(3000).fill(1).map((v, i) => i)
      , content = payload.join()
    payload.forEach(v => {
      fs.mkdirSync('/tmp/navy-clock-build-test/dir_' + v)
      fs.writeFileSync('/tmp/navy-clock-build-test/dir_' + v + '/test', content)
    })
  })

  it('should successfully prepare the build directory', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data =
        { prepareDir: '/tmp/navy-clock-build-test'
        , finalBuildDir: '/tmp/navy-clock-build/'
        }

    prepareToBuild(context, data, function (error) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true)
      var filePath = '/tmp/navy-clock-build/dir_0/test'
      fs.exists(filePath, function (fileExists) {
        fileExists.should.equal(true, filePath + ' does not exist')
        done()
      })
    })
  })

  it('should do nothing if isMaster is false', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: false }
      , data = {}

    prepareToBuild(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

  after(function (done) {
    rmdir('/tmp/navy-clock-build-test', function () {
      rmdir('/tmp/navy-clock-build/', function () {
        done()
      })
    })
  })
})
