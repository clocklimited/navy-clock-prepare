var sinon = require('sinon')
  , should = require('should')
  , rewire = require('rewire')
  , createCloneOrUpdate = rewire('../../lib/clone-or-update')
  , git =
    { clone: function(repo, prepareDir, onData, callback) {
        onData()
        callback()
      }
    , fetch: function(prepareDir, onData, callback) {
        onData()
        callback()
      }
    }

describe('clone-or-update', function () {

  it('should emit data on clone', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data = { prepareDir: '/tmp' }
      , cloneSpy = sinon.spy(git, 'clone')

    /* jshint camelcase: false */
    createCloneOrUpdate.__set__('fs', {
      exists: function (dir, callback) {
        callback(false)
      }
    })

    var cloneOrUpdate = createCloneOrUpdate(git)

    cloneOrUpdate(context, data, function (error, newData) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true)
      cloneSpy.calledOnce.should.equal(true)
      newData.prepareDir.should.equal('/tmp')
      done()
    })
  })

  it('should emit data on fetch', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: true }
      , data = { prepareDir: '/tmp' }
      , fetchSpy = sinon.spy(git, 'fetch')

    /* jshint camelcase: false */
    createCloneOrUpdate.__set__('fs', {
      exists: function (dir, callback) {
        callback(true)
      }
    })

    var cloneOrUpdate = createCloneOrUpdate(git)

    cloneOrUpdate(context, data, function (error, newData) {
      should.not.exist(error)
      emitSpy.calledTwice.should.equal(true)
      fetchSpy.calledOnce.should.equal(true)
      newData.prepareDir.should.equal('/tmp')
      done()
    })
  })

  it('should do nothing if isMaster is false', function (done) {
    var emitSpy = sinon.spy()
      , context = { emit: emitSpy, isMaster: false }
      , data = {}
      , cloneOrUpdate = createCloneOrUpdate(git)

    cloneOrUpdate(context, data, function (error) {
      should.not.exist(error)
      emitSpy.callCount.should.equal(1)
      emitSpy.calledWith('Not the master captain. Skipping step').should.equal(true)
      done()
    })
  })

})
