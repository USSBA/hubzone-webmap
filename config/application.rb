require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module HubzoneMap
  # Configuration for deployment
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.load_defaults 5.1
    # Adding the X-UA-Compatible header. Needed to work with IE compatablity mode
    config.action_dispatch.default_headers.merge!('X-UA-Compatible' => 'IE=edge,chrome=1')
  end
end
