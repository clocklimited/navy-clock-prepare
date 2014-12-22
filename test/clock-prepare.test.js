var should = require('should')
  , assert = require('assert')
  , clockPrepare = require('../index')()

describe('clock-prepare', function () {

  it('should return steps', function () {
    var steps = clockPrepare.getSteps()
    assert.equal(typeof steps.init, 'function')
    assert.equal(typeof steps.cloneOrUpdate, 'function')
    assert.equal(typeof steps.compareCurrentTag, 'function')
    assert.equal(typeof steps.checkoutTag, 'function')
    assert.equal(typeof steps.initSubmodules, 'function')
    assert.equal(typeof steps.runPrepare, 'function')
    assert.equal(typeof steps.prepareToBuild, 'function')
    assert.equal(typeof steps.runBuild, 'function')
    assert.equal(typeof steps.cleanBuild, 'function')
    assert.equal(typeof steps.tarBuild, 'function')
    assert.equal(typeof steps.serveBuild, 'function')
    assert.equal(typeof steps.removeBuildTar, 'function')
  })

  it('should return steps list', function () {
    var stepList = clockPrepare.getStepList()
    stepList.length.should.equal(12)
    stepList[0].should.equal('init')
    stepList[1].should.equal('cloneOrUpdate')
    stepList[2].should.equal('compareCurrentTag')
    stepList[3].should.equal('checkoutTag')
    stepList[4].should.equal('initSubmodules')
    stepList[5].should.equal('runPrepare')
    stepList[6].should.equal('prepareToBuild')
    stepList[7].should.equal('runBuild')
    stepList[8].should.equal('cleanBuild')
    stepList[9].should.equal('tarBuild')
    stepList[10].should.equal('serveBuild')
    stepList[11].should.equal('removeBuildTar')
  })

  it('should run the init function', function (done) {
    var steps = clockPrepare.getSteps()
      , context =
        { appId: 'myapp'
        , environment: 'staging'
        , orderArgs: [ '1.0.0' ]
        , appData: { client: 'client', buildDir: '/tmp/build', repository: 'path-to-git-repo' }
        }

    steps.init(context, function (error, data) {
      should.not.exist(error)
      Object.keys(data).length.should.equal(7)
      data.appVersion.should.equal(context.orderArgs[0])
      data.environment.should.equal(context.environment)
      data.client.should.equal(context.appData.client)
      data.buildDir.should.equal(context.appData.buildDir)
      data.repository.should.equal(context.appData.repository)

      var expectedFinaBuildlDir =
        context.appData.buildDir + '/' + context.appData.client + '-' + context.appId + '-'
          + context.environment + '-' + context.orderArgs[0]

      data.finalBuildDir.should.equal(expectedFinaBuildlDir)
      done()
    })
  })

})
