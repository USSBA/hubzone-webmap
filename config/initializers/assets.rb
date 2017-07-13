# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path
%w[js css img fonts].each do |p|
  Rails.application.config.assets.paths <<
    Rails.root.join("vendor", "assets", "uswds-0.13.1", p)
end
Rails.application.config.assets.paths <<
  Rails.root.join("vendor", "assets", "uswds-0.13.1", "img", "favicons")

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.precompile += %w[*.png *.jpg *.jpeg *.gif *.svg]

# Allow path helpers in JavaScript assets.
# http://stackoverflow.com/questions/7451517/using-a-rails-helper-method-within-a-javascript-asset
Sprockets::Context.send :include, Rails.application.routes.url_helpers
