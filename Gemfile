source 'https://rubygems.org'

gem 'coffee-rails', '~> 4.2' # Use CoffeeScript for .coffee assets and views
gem 'dotenv-rails' # Use dotenv to load environment variables
gem 'excon-rails' # Use excon rails for http requests
gem 'font-awesome-rails', '>= 4.7.0' # Use Font Awesome for CSS Icons
gem 'i18n-js', ">= 3.0.0.rc15" #extend i18n support directly into JS
gem 'jbuilder', '~> 2.5' # Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jquery-rails' # Use jquery as the JavaScript library
gem 'pg' # Use PostgreSQL as the database for Active Record
gem 'puma', '~> 3.0' # Use Puma as the app server
gem 'rails', '~> 5.1' # Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rb-readline' # Why is this suddenly such a problem?
gem 'sass-rails', '~> 5.0' # Use SCSS for stylesheets
gem 'uglifier', '>= 1.3.0' # Use Uglifier as compressor for JavaScript assets

# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
# gem 'turbolinks', '~> 5'

# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  gem "brakeman", require: false # code analysis  (http://brakemanscanner.org)
  gem 'byebug', platform: :mri # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'capybara' # allow interaction with DOM in tests
  gem 'chromedriver-helper'
  # gem 'chunky_png' # read png images
  gem 'jasmine-rails' # JavaScript testing
  gem 'jshint'
  gem 'launchy'
  gem 'poltergeist'
  gem 'rspec-rails', '~> 3.5' # Use RSpec for tests
  gem 'rubocop' # Enforce ruby code style
  gem 'selenium-webdriver'
  gem 'simplecov', require: false # determine code coverage of tests
  gem 'teaspoon-jasmine'
end

group :development do
  gem 'better_errors' # show a much more friendly error page with a command line REPL
  gem 'binding_of_caller' # used by better_errors to provide a REPL in the error window
  gem 'listen', '~> 3.0.5'
  gem 'spring' # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console' # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
end
