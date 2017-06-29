require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module HubzoneMap
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Adding the X-UA-Compatible header.
    config.action_dispatch.default_headers.merge!('X-UA-Compatible' => 'IE=edge,chrome=1')
  end
end
