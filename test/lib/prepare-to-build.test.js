var sinon = require('sinon')
  , should = require('should')
  , fs = require('fs')
  , rmdir = require('rmdir')
  , prepareToBuild = require('../../lib/prepare-to-build')()

describe('prepare-to-build', function () {

  before(function (done) {
    fs.mkdir('/tmp/navy-clock-build-test', function () {
      fs.writeFile('/tmp/navy-clock-build-test/test', 'hello', function () {
        fs.mkdir('/tmp/navy-clock-build/', done)
      })
    })
  })

  it('should successfully prepare the build directory', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy }
      , data =
        { prepareDir: '/tmp/navy-clock-build-test'
        , finalBuildDir: '/tmp/navy-clock-build/'
        }

    prepareToBuild(context, data, function (error) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true)
      var filePath = '/tmp/navy-clock-build/test'
      fs.exists(filePath, function (fileExists) {
        fileExists.should.equal(true, filePath + ' does not exist')
        done()
      })
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
