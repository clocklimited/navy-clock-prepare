var should = require('should')
  , sinon = require('sinon')
  , createExecuteCopyOrder = require('../../lib/execute-copy-order')
  , config = { externalIpAddress: '10.0.0.2' }
  , executeCopyOrder = createExecuteCopyOrder(config)

describe('execute-copy-order', function () {

  function getContext(data, emitSpy, outcome) {
    return { emit: emitSpy
    , executeOrder: function (order, args, callback) {
        order.should.equal('rsync')
        args.length.should.equal(2, 'order args not the expected length')
        args[0].should.equal(config.externalIpAddress + ':' + data.finalBuildDir)
        args[1].should.equal(data.buildDir)
        callback({ success: outcome })
      }
    }
  }

  it('should correctly execute copy order', function (done) {
    var emitSpy = sinon.spy()
      , data = { buildDir: '/tmp/build', finalBuildDir: '/tmp/build/myapp' }
      , context = getContext(data, emitSpy, true)

    executeCopyOrder(context, data, function (error) {
      should.not.exist(error)
      emitSpy.calledOnce.should.equal(true, 'emit called once')
      done()
    })
  })

  it('should fail to execute copy order', function (done) {
    var emitSpy = sinon.spy()
      , data = { buildDir: '/tmp/build', finalBuildDir: '/tmp/build/myapp' }
      , context = getContext(data, emitSpy, false)

    executeCopyOrder(context, data, function (error) {
      should.exist(error)
      emitSpy.calledTwice.should.equal(true, 'emit called twice')
      done()
    })
  })

})
