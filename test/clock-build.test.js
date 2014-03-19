var clockBuild = require('../index')()
  , async = require('async')

describe('clock-build', function () {

  // THIS IS LITERALLY JUST A RUNNER, NOT AN ACTUAL TEST!
  it.skip('should run', function (done) {
    this.timeout(10000000)
    var steps = clockBuild.getSteps()
      , stepNames = clockBuild.getStepList()
      , context =
        { orderArgs: [ 'staging', 'v1.50.0' ]
        , emit: function (msg) { console.log(msg) }
        }
      , tasks = []

    stepNames.forEach(function (stepName) {
      var task = steps[stepName].bind(this, context)
      tasks.push(task)
    })

    async.waterfall(tasks, function (error) {
      if (error) throw error
      done()
    })

  })

})
