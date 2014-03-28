var createGit = require('../../lib/git')

describe('git', function () {

  it('should run clone command', function (done) {

    function runCmd(cmd, args, options, onData, callback) {
      cmd.should.equal('git')
      args.length.should.equal(3)
      args[0].should.equal('clone')
      args[1].should.equal('my-git-repo-url')
      args[2].should.equal('/tmp')
      callback()
    }

    var git = createGit(runCmd)
    git.clone('my-git-repo-url', '/tmp', null, function () {
      done()
    })

  })

  it('should run fetch command', function (done) {

    function runCmd(cmd, args, options, onData, callback) {
      cmd.should.equal('git')
      args.length.should.equal(1)
      args[0].should.equal('fetch')
      options.cwd.should.equal('/tmp')
      callback()
    }

    var git = createGit(runCmd)
    git.fetch('/tmp', null, function () {
      done()
    })

  })

  it('should run checkout command', function (done) {

    function runCmd(cmd, args, options, onData, callback) {
      cmd.should.equal('git')
      args.length.should.equal(2)
      args[0].should.equal('checkout')
      args[1].should.equal('my-tag')
      options.cwd.should.equal('/tmp')
      callback()
    }

    var git = createGit(runCmd)
    git.checkout('my-tag', '/tmp', null, function () {
      done()
    })

  })

  it('should run submoduleInit command', function (done) {

    function runCmd(cmd, args, options, onData, callback) {
      cmd.should.equal('git')
      args.length.should.equal(3)
      args[0].should.equal('submodule')
      args[1].should.equal('update')
      args[2].should.equal('--init')
      options.cwd.should.equal('/tmp')
      callback()
    }

    var git = createGit(runCmd)
    git.submoduleInit('/tmp', null, function () {
      done()
    })

  })

  it('should run rev-parse with provided tag', function (done) {

    function runCmd(cmd, args, options, onData, callback) {
      cmd.should.equal('git')
      args.length.should.equal(3)
      args[0].should.equal('rev-parse')
      args[1].should.equal('--short')
      args[2].should.equal('my-tag')
      options.cwd.should.equal('/tmp')
      callback()
    }

    var git = createGit(runCmd)
    git.revParse('my-tag', '/tmp', null, function () {
      done()
    })

  })

  it('should run rev-parse with HEAD when no tag provided', function (done) {

    function runCmd(cmd, args, options, onData, callback) {
      cmd.should.equal('git')
      args.length.should.equal(3)
      args[0].should.equal('rev-parse')
      args[1].should.equal('--short')
      args[2].should.equal('HEAD')
      options.cwd.should.equal('/tmp')
      callback()
    }

    var git = createGit(runCmd)
    git.revParse('/tmp', null, function () {
      done()
    })

  })

})
