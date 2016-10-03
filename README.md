# HUBZone Map

This application will eventually house the new and improved HUBZone Map for the Small Business Administration.

Requirements:
* rvm
  - http://rvm.io/
* ruby 2.3.1
  - `rvm install 2.3.1`
* bundler 1.12.5
  - `gem install -v 1.12.5 bundler`
* postgresql 9.5
  - I use [Postgres.app](http://postgresapp.com/)
  - could also use `brew install postgresql`

After cloning the repo, run the following:
``` bash
cd hubzone_map
bundle install
bundle exec rake db:create
rails server
```

To run the test suite, simply run:
* `rspec`
* or with verbose output: `rspec -f d`

To look at the map from the google-maps-api-playground repo, run the following:
``` bash
cd hubzone_map
git checkout map-playground
rails server
```
Then point your browser to http://localhost:3000/map/fake
