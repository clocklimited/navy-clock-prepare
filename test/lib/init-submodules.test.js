var sinon = require('sinon')
  , should = require('should')
  , createInitSubmodules = require('../../lib/init-submodules')
  , git =
    { submoduleInit: function(buildDir, onData, callback) {
        onData()
        callback()
      }
    }

describe('init-submodules', function () {

  it('should emit data on submodule init', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy }
      , data = { buildDir: '/tmp' }
      , initSubmodules = createInitSubmodules(git)

    initSubmodules(context, data, function (error, newData) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true)
      newData.buildDir.should.equal('/tmp')
      done()
    })
  })

})
