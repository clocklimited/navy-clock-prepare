var sinon = require('sinon')
  , should = require('should')
  , fs = require('fs')
  , rmdir = require('rmdir')
  , cleanBuild = require('../../lib/clean-build')()

describe('clean-build', function () {

  before(function (done) {
    fs.mkdir('/tmp/navy-clock-build-clean/', function () {
      fs.mkdir('/tmp/navy-clock-build-clean/.git', done)
    })
  })

  it('should successfully prepare the build directory', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy }
      , data =
        { finalBuildDir: '/tmp/navy-clock-build-clean/'
        }

    cleanBuild(context, data, function (error) {
      should.not.exist(error)
      emitSpy.calledOnce.should.equal(true)
      var filePath = '/tmp/navy-clock-build-clean/.git'
      fs.exists(filePath, function (fileExists) {
        fileExists.should.equal(false, filePath + ' has not been removed')
        done()
      })
    })
  })

  after(function (done) {
    rmdir('/tmp/navy-clock-build-clean', done)
  })

})
