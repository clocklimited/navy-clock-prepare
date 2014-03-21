var should = require('should')
  , assert = require('assert')
  , clockPrepare = require('../index')()

describe('clock-prepare', function () {

  it('should return steps', function () {
    var steps = clockPrepare.getSteps()
    assert.equal(typeof steps.init, 'function')
    assert.equal(typeof steps.cloneOrUpdate, 'function')
    assert.equal(typeof steps.checkoutTag, 'function')
    assert.equal(typeof steps.initSubmodules, 'function')
    assert.equal(typeof steps.runPrepare, 'function')
  })

  it('should return steps list', function () {
    var stepList = clockPrepare.getStepList()
    stepList.length.should.equal(5)
    stepList[0].should.equal('init')
    stepList[1].should.equal('cloneOrUpdate')
    stepList[2].should.equal('checkoutTag')
    stepList[3].should.equal('initSubmodules')
    stepList[4].should.equal('runPrepare')
  })

  it('should run the init function', function (done) {
    var steps = clockPrepare.getSteps()
      , context =
        { orderArgs: [ '1.0.0' ]
        , appData: { repository: 'my-repo', prepareDir: '/tmp' }
        }

    steps.init(context, function (error, data) {
      should.not.exist(error)
      Object.keys(data).length.should.equal(3)
      data.appVersion.should.equal(context.orderArgs[0])
      data.repository.should.equal(context.appData.repository)
      data.prepareDir.should.equal(context.appData.prepareDir)
      done()
    })
  })

})
