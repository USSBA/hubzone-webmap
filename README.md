# HUBZone Map

This application houses the new and improved HUBZone Map for the Small Business Administration.  All development is currently being done off of the `develop` branch.

##### Table of Contents
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Configure Environment](#configure-environment)
- [Deployment](#deployment)
  - [Develop](#development)
  - [Staging and Production](#staging-and-production)
- [Testing](#testing)
  - [Rspec](#rspec)
  - [Rubocop](#rubocop)
  - [Javascript Testing](#javascript-testing)

## Installation:
### Requirements:
* rvm
  - http://rvm.io/
* ruby 2.3.3
  - `rvm install 2.3.3`
* bundler 1.13.6
  - `rvm @global do gem install -v 1.13.6 bundler`
* JavaScript interpreter (node)
  * nvm
    * `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash`
  * Install node
    * `nvm install 5`
* PhantomJS 1.8.1, or newer (required for Capybara tests with Poltergeist)
  * Mac
    * `brew install phantomjs`
  * Linux
    * [download this tarball](https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2)
    * Extract the tarball and copy `bin/phantomjs` into your `PATH`
* postgresql 9.5
  * Mac
    - I use [Postgres.app](http://postgresapp.com/)
    - could also use `brew install postgresql`
    - set `PGSQL_HOME` to your installation dir
      - e.g. `export PGSQL_HOME=/Applications/Postgres.app/Contents/Versions/9.5`
    - ensure that the bin directory is in your path
      - e.g. `export PATH=${PATH}:${PGSQL_HOME}/bin`
  * Linux (rhel)
    * Install:
      * `yum install https://download.postgresql.org/pub/repos/yum/9.5/redhat/rhel-6-x86_64/pgdg-redhat95-9.5-3.noarch.rpm`
      * `yum install postgresql95-server postgresql95-devel`
    * Configure:
      * `echo 'export PGSQL_HOME=/usr/pgsql-9.5' >> ~/.bashrc`
      * `echo 'export PATH=${PATH}:${PGSQL_HOME}/bin' >> ~/.bashrc`

### Configure Environment
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


## Deployment

### Development:
In one console launch
```bash
bin/webpack-dev-server
```
Wait a bit for the assets to compile, then in another console launch
``` bash
rails server
```
Then point your browser to http://localhost:3000/

Note: for the map to "work", you will need to have the API and GeoServer running as well.  See the README in the hubzone-api repository for details.

### Staging and Production:

The task `webpack:compile` is included with `assets:precompile` https://github.com/rails/webpacker#deployment, so just launching `RAILS_ENV=production rake assets:precompile` will compile styles, images, etc. and then run webpack to bundle the hzmap.js part of the app.


## Testing

### Rspec

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

### Javascript Testing
#### Teaspoon / Jasmine / Istanbul Unit and Coverage
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
Tring to use this JSHint gem [JSHint](https://github.com/damian/jshint), per its docs:

Add `gem 'jshint'` to the Gemfile under `group :development, :test`

Run `bundle` to install, then run `bundle exec rake jshint` to run test.  Currently this is running the linter then causing a rake error if there are any lint errors, which appears to be an ongoing issue with this gem.
