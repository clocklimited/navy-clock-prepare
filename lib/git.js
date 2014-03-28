module.exports = function createGit(runCmd) {

  function clone(repo, dest, onData, callback) {
    var args = [ 'clone', repo, dest ]
    runCmd('git', args, {}, onData, callback)
  }

  function fetch(gitDir, onData, callback) {
    var args = [ 'fetch' ]
      , options = { cwd: gitDir }

    runCmd('git', args, options, onData, callback)
  }

  function checkout(branchOrTag, gitDir, onData, callback) {
    var args = [ 'checkout', branchOrTag ]
      , options = { cwd: gitDir }

    runCmd('git', args, options, onData, callback)
  }

  function submoduleInit(gitDir, onData, callback) {
    var args = [ 'submodule',  'update', '--init' ]
      , options = { cwd: gitDir }

    runCmd('git', args, options, onData, callback)
  }

  function revParse(branchOrTag, gitDir, onData, callback) {
    if (!callback) {
      callback = onData
      onData = gitDir
      gitDir = branchOrTag
      branchOrTag = 'HEAD'
    }
    var args = [ 'rev-parse', '--short', branchOrTag ]
      , options = { cwd: gitDir }

    runCmd('git', args, options, onData, callback)
  }

  return {
    clone: clone
  , fetch: fetch
  , checkout: checkout
  , submoduleInit: submoduleInit
  , revParse: revParse
  }
}
