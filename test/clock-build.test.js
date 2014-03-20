var should = require('should')
  , assert = require('assert')
  , clockBuild = require('../index')()

describe('clock-build', function () {

  it('should return steps', function () {
    var steps = clockBuild.getSteps()
    assert.equal(typeof steps.init, 'function')
    assert.equal(typeof steps.cloneOrUpdate, 'function')
    assert.equal(typeof steps.checkoutTag, 'function')
    assert.equal(typeof steps.initSubmodules, 'function')
    assert.equal(typeof steps.runSetup, 'function')
  })

  it('should return steps list', function () {
    var stepList = clockBuild.getStepList()
    stepList.length.should.equal(5)
    stepList[0].should.equal('init')
    stepList[1].should.equal('cloneOrUpdate')
    stepList[2].should.equal('checkoutTag')
    stepList[3].should.equal('initSubmodules')
    stepList[4].should.equal('runSetup')
  })

  it('should run the init function', function (done) {
    var steps = clockBuild.getSteps()
      , context =
        { orderArgs: [ 'staging', '1.0.0' ]
        , appData: { repository: 'my-repo', buildDir: '/tmp' }
        }

    steps.init(context, function (error, data) {
      should.not.exist(error)
      Object.keys(data).length.should.equal(4)
      data.environment.should.equal(context.orderArgs[0])
      data.appVersion.should.equal(context.orderArgs[1])
      data.repository.should.equal(context.appData.repository)
      data.buildDir.should.equal(context.appData.buildDir)
      done()
    })
  })

})
