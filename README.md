# HUBZone Map

This application houses the new and improved HUBZone Map for the Small Business Administration.  All development is currently being done off of the `develop` branch.

### Table of Contents
- [License](#license)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Building](#building)
  - [Deploying](#deploying)
- [Testing](#testing)
- [Additional Configuration](#additional-configuration)
- [External Services](#external-services)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [Security Issues](#security-issues)
- [Code of Conduct](#code-of-conduct)

## License

## Installation
### Requirements:
* RVM
  - http://rvm.io/
* Ruby 2.3.3
  - `rvm install 2.3.3`
* Bundler
  - `rvm @global do gem install bundler`
  - Tested with version 1.13.6 or later
* PhantomJS 1.8.1, or newer (required for Capybara tests with Poltergeist)
  * Mac
    * `brew install phantomjs`
  * Linux
    * [download this tarball](https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2)
    * Extract the tarball and copy `bin/phantomjs` into your `PATH`
* PostgreSQL 9.5
  * Mac
    - Use [Postgres.app](http://postgresapp.com/)
    - Can also use `brew install postgresql`
    - Set `PGSQL_HOME` to your installation dir
      - e.g. `export PGSQL_HOME=/Applications/Postgres.app/Contents/Versions/9.5`
    - Ensure that the bin directory is in your path
      - e.g. `export PATH=${PATH}:${PGSQL_HOME}/bin`
  * Linux (rhel)
    * Install:
      * `yum install https://download.postgresql.org/pub/repos/yum/9.5/redhat/rhel-6-x86_64/pgdg-redhat95-9.5-3.noarch.rpm`
      * `yum install postgresql95-server postgresql95-devel`
    * Configure:
      * `echo 'export PGSQL_HOME=/usr/pgsql-9.5' >> ~/.bashrc`
      * `echo 'export PATH=${PATH}:${PGSQL_HOME}/bin' >> ~/.bashrc`

### Building
After cloning the repo, checkout out the `develop` branch and set up your environment:
```
git checkout develop
cp example.env .env
# edit .env to provide your postgresql user/password and, if necessary, override any defaults
```

Then run the following:
``` bash
bundle install
bundle exec rake db:create db:migrate
```

If the `bundle install` fails due to the pg gem, make sure you have the ENV vars above set in your shell.

### Deploying
To launch the map:
``` bash
rails server
```
Then point your browser to http://localhost:3000/

Note: for the map to "work", you will need to have the Hubzone API and an instance of  GeoServer running as well.  See the README in the [hubzone-api](https://github.com/USSBA/hubzone-api) repository for details.

## Additional configuration

Must connect to a GeoServer instance to produce map tiles
  - http://geoserver.org/

## Testing

### Rspec Tests

To run the test suite, simply run:
```
rspec
```

or with verbose output:
```
rspec -f d
```

To view the coverage report, open
```
coverage/index.html
```

### Rubocop
```
rubocop -D
```

### Javascript Tests
#### Teaspoon / Jasmine / Istanbul Unit and Coverage tests
Teaspoon is used for Javascript testing and coverage.  It runs Jasmine for unit and integration tests and Istanbul for test coverage.

First install Istanbul:
```
npm install -g istanbul
```

To run Teaspoon for unit tests, run:
```
bundle exec teaspoon
```

To include Istanbul coverage tests, run:
```
bundle exec teaspoon --coverage=default
```

To view interactive report of test coverage, open:
```
coverage/default/index.html
```

To view live version of Teaspoon tests
```
localhost:3000/teaspoon
```

#### JSHint Lint Tests
Using this JSHint gem [JSHint](https://github.com/damian/jshint), per its docs:

Add `gem 'jshint'` to the Gemfile under `group :development, :test`

Run `bundle` to install, then run `bundle exec rake jshint` to run test.  

## External services
- Connect to [Google Map API](https://developers.google.com/maps/) by putting your key in the .env file
- Connect to [Google Analytics](https://www.google.com/analytics/analytics/features/) by putting your key in the .env file

## Changelog
Refer to the changelog for details on API updates. [CHANGELOG](CHANGELOG.md)

## Contributing

## Security Issues

## Code of Conduct
