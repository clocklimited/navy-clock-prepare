var sinon = require('sinon')
  , should = require('should')
  , createCompareCurrentTag = require('../../lib/compare-current-tag')

describe('compare-current-tag', function () {

  function createGit(hashOne, hashTwo) {
    return {
      revParse: function(branchOrTag, gitDir, onData, callback) {
        if (!callback) {
          callback = onData
          onData = gitDir
          branchOrTag = 'HEAD'
        }
        var hash = hashOne
        if (branchOrTag === 'HEAD') {
          hash = hashTwo
        }
        onData(hash)
        callback()
      }
    }
  }

  it('should set canSkip to true when git hashes are equal', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data = { }
      , git = createGit('abcde12345', 'abcde12345')
      , compareCurrentTag = createCompareCurrentTag(git)

    compareCurrentTag(context, data, function (error, newData) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true, 'emit not called twice')
      newData.canSkip.should.equal(true, 'can skip is incorrect')
      done()
    })
  })

  it('should set canSkip to false when git hashes are not equal', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data = { }
      , git = createGit('abcde12345', '54321edcba')
      , compareCurrentTag = createCompareCurrentTag(git)

    compareCurrentTag(context, data, function (error, newData) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true, 'emit not called twice')
      newData.canSkip.should.equal(false, 'can skip is incorrect')
      done()
    })
  })

  it('should do nothing if isMaster is false', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: false }
      , data = {}
      , compareCurrentTag = createCompareCurrentTag()

    compareCurrentTag(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

})
