# Clock Prepare Order

This is an Order which is used by [Captains](http://github.com/microadam/navy-captain) as part of the Navy deployment suite.

It does the following actions:

* Clone a specified GIT repository to a specified prepare location OR execute a fetch on the existing GIT repository
* Compare currently checked out branch or tag to the one we are trying to checkout. If the commit hash is the same, skip remaining steps
* Checkout the specified GIT branch or tag
* Initialise or update all submodule references
* Run npm run-script prepare

This order assumes that the following configuration keys have been added to the [Admiral](http://github.com/microadam/navy-admiral) for the application you are trying to prepare:

* repository: The URL to the GIT repository where your application is stored
* prepareDir: Where the GIT repository should be cloned to

An example [Admiral](http://github.com/microadam/navy-admiral) application configuration might look like:

    { "name": "My Application"
    , "appId": "myApp"
    , "repository": "git@github.com:clocklimited/navy-clock-prepare.git"
    , "prepareDir": "/tmp/my-application-prepare-dir"
    }
