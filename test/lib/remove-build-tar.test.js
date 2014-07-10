var sinon = require('sinon')
  , should = require('should')
  , fs = require('fs')
  , removeBuildTar = require('../../lib/remove-build-tar')()
  , filePath = '/tmp/test-remove-build.tar'

describe('remove-build-tar', function () {

  before(function (done) {
    fs.writeFile(filePath, 'test', done)
  })

  it('should successfully remove the build tar', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data =
        { tarPath: filePath
        }

    removeBuildTar(context, data, function (error) {
      should.not.exist(error)
      emitSpy.calledOnce.should.equal(true)
      fs.exists(filePath, function (fileExists) {
        fileExists.should.equal(false, filePath + ' has not been removed')
        done()
      })
    })
  })

  it('should do nothing if isMaster is false', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: false }
      , data = {}

    removeBuildTar(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

})
