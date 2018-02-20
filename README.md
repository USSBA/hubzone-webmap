# HUBZone Map

This application houses the new and improved HUBZone Map for the Small Business Administration.  All development is currently being done off of the `develop` branch.

### Table of Contents
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Building](#building)
  - [Deploying](#deploying)
- [Additional Configuration](#additional-configuration)
- [Testing](#testing)
- [External Services](#external-services)
- [Changelog](#changelog)
- [License](#license)
- [Contributing](#contributing)
- [Security Issues](#security-issues)

## Installation
### Requirements:
* RVM
  - http://rvm.io/
* Ruby 2.3.3
  - `rvm install 2.3.3`
* Bundler
  - `rvm @global do gem install bundler`
  - Tested with version 1.13.6 or later
* PhantomJS 2.1.1, or newer (required for Capybara tests with Poltergeist)
  * Mac
    * `brew install phantomjs`
  * Linux
    * [download this tarball](https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2)
    * Extract the tarball and copy `bin/phantomjs` into your `PATH`
* PostgreSQL 9.6
  * Mac
    - Use [Postgres.app](http://postgresapp.com/)
    - Can also use `brew install postgresql`
    - Set `PGSQL_HOME` to your installation dir
      - e.g. `export PGSQL_HOME=/Applications/Postgres.app/Contents/Versions/9.6`
    - Ensure that the bin directory is in your path
      - e.g. `export PATH=${PATH}:${PGSQL_HOME}/bin`
  * Linux (rhel)
    * Install:
      * `yum install https://download.postgresql.org/pub/repos/yum/9.6/redhat/rhel-6-x86_64/pgdg-redhat96-9.6-3.noarch.rpm`
      * `yum install postgresql96-server postgresql96-devel`
    * Configure:
      * `echo 'export PGSQL_HOME=/usr/pgsql-9.6' >> ~/.bashrc`
      * `echo 'export PATH=${PATH}:${PGSQL_HOME}/bin' >> ~/.bashrc`
* Poirot
  - Install [Poirot](https://github.com/emanuelfeld/poirot) python utility, typically `pip install poirot` and make sure that poirot is available in PATH by confirming that your PYTHON/bin folder is in PATH.
  - Refer to [Poirot Secrets Testing](#poirot-secrets-testing) for information on running this tool.
  - For local development, run the rake task to copy the `pre-commit-poirot` script to your local `.git/hooks/pre-commit` hook.
    ```
      rake hz:poirot_hooks
    ```

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

### Ruumba
```
ruumba app/ -D -c .ruumba.yml
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

#### Poirot Secrets Testing
A secrets pattern file `hubzone-poirot-patterns.txt` is included with the app to assist with running [Poirot](https://github.com/emanuelfeld/poirot) to scan commit history for secrets.  It is recommended to run this only the current branch only:
```
  poirot --patterns hubzone-poirot-patterns.txt --revlist="develop^..HEAD"
```
Poirot will return an error status if it finds any secrets in the commit history between `HEAD` and develop.  You can correct these by: removing the secrets and squashing commits or by using something like BFG.

Note that Poirot is hardcoded to run in case-insensitive mode and uses two different regex engines (`git log --grep` and a 3rd-party Python regex library https://pypi.python.org/pypi/regex/ ). Refer to Lines 121 and 195 in `<python_path>/site-packages/poirot/poirot.py`. The result is that the 'ssn' matcher will flag on: 'ssn', 'SSN', or 'ssN', etc., which also 'className', producing false positive errors in the full rev history.  Initially we included the `(?c)` flag in the SSN matchers: `.*(ssn)(?c).*[:=]\s*[0-9-]{9,11}` however this is not compatible with all regex engines and causes an error in some cases.  During the `--revlist="all"` full history Poirot runs, this pattern failed silently with the `git --grep` engine and therefore did not actually run.  During the `--staged` Poirot runs, this pattern fails with a stack trace with the `pypi/regex` engine. The `(?c)` pattern has been removed entirely and so the `ssn` patterns can still flag on false positives like 'className'.

##### Poirot Git Hooks
A rake task was included to copy a template `pre-commit-poirot` shell script to the local users `.git/hooks/pre-commit` hook.  This will run Poirot using the patterns file mentioned above on any staged files.  The pre-commit script was copied from https://raw.githubusercontent.com/DCgov/poirot/master/pre-commit-poirot.
```
  rake hz:poirot_hooks
```

## External services
- Connect to [Google Map API](https://developers.google.com/maps/) by putting your key in the .env file
- Connect to [Google Analytics](https://www.google.com/analytics/analytics/features/) by putting your key in the .env file

## Changelog
Refer to the changelog for details on API updates. [CHANGELOG](CHANGELOG.md)

## License
The HUBZone-WebMap is licensed permissively under the Apache License v2.0.
A copy of that license is distributed with this software.

This project may use Google APIs. The Google API are licensed under their Google API's [terms and conditions](https://developers.google.com/maps/terms).

## Contributing
We welcome contributions. Please read [CONTRIBUTING](CONTRIBUTING.md) for how to contribute.

We strive for a welcoming and inclusive environment for the HUBZone-WebMap project.

Please follow this guidelines in all interactions:

1. Be Respectful: use welcoming and inclusive language.
2. Assume best intentions: seek to understand other's opinions.

## Security Issues
Please do not submit an issue on GitHub for a security vulnerability. Please contact the development team through the Certify Help Desk at [help@certify.sba.gov](mailto:help@certify.sba.gov).

Be sure to include all the pertinent information.

<sub>The agency reserves the right to change this policy at any time.</sub>
