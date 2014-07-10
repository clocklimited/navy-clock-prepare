# Clock Prepare Order

This is an Order which is used by [Captains](http://github.com/microadam/navy-captain) as part of the Navy deployment suite.

It does the following actions (note, these steps will only be run on the 'master' Captain):

* Clone a specified GIT repository to a specified prepare location OR execute a fetch on the existing GIT repository
* Compare currently checked out branch or tag to the one we are trying to checkout. If the commit hash is the same, skip remaining steps
* Checkout the specified GIT branch or tag
* Initialise or update all submodule references
* Run npm run-script prepare
* Copy prepare directory to application specfic subdirectory of the build directory
* Run npm run-script build inside the application subdirectory
* Clean up the application subdirectory of any non application files
* Tar up the application subdirectory and place in /tmp
* Start up a HTTP server on a random port and issue a order to other ['\'requestBuild\''](https://github.com/clocklimited/navy-clock-request-build) order to other [Captains](http://github.com/microadam/navy-captain)
* Remove the tar file in /tmp

This order assumes that the following configuration keys have been added to the [Admiral](http://github.com/microadam/navy-admiral) for the application you are trying to prepare:

* repository: The URL to the GIT repository where your application is stored
* prepareDir: Where the GIT repository should be cloned to
* buildDir: Directory into which the prepareDir should be copied. The directory specific to your application will be a subdirectory of this directory

An example [Admiral](http://github.com/microadam/navy-admiral) application configuration might look like:

    { "name": "My Application"
    , "appId": "myApp"
    , "repository": "git@github.com:clocklimited/navy-clock-prepare.git"
    , "prepareDir": "/tmp/my-application-prepare-dir"
    , "buildDir": "/var/application"
    }

This order assumes that the following config options have been set on your [Captains](http://github.com/microadam/navy-captain) that will run this order

* externalHost: host of the Captain running this order. This should be able to be used to access the Captain running this order, from other Captains

An example [Captain](http://github.com/microadam/navy-captain) config file might look like:

    module.exports = function () {

      var config =
      { name: 'captain-one'
      , applications: { exampleAppId: [ 'staging', 'production' ] }
      , admiral: { host: '127.0.0.1', port: 8006 }
      , orderDir: __dirname + '/orders'
      , orders:
        { 'navy-clock-prepare': { command: 'prepare', config: { externalHost: '10.0.0.1' } }
        }
      }

      return config
    }
