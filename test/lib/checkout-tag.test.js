var sinon = require('sinon')
  , should = require('should')
  , createCheckoutTag = require('../../lib/checkout-tag')
  , git =
    { checkout: function(tag, prepareDir, onData, callback) {
        onData()
        callback()
      }
    }

describe('checkout-tag', function () {

  it('should emit data on checkout', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data = { appVersion: '1.0.0' }
      , checkoutTag = createCheckoutTag(git)

    checkoutTag(context, data, function (error, newData) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true)
      newData.appVersion.should.equal('1.0.0')
      done()
    })
  })

  it('should do nothing if canSkip is true', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data = { canSkip: true }
      , checkoutTag = createCheckoutTag(git)

    checkoutTag(context, data, function (error, newData) {
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
      , checkoutTag = createCheckoutTag(git)

    checkoutTag(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

})
