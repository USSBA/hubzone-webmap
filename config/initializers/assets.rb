# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path
%w(js css img fonts).each do |p|
  Rails.application.config.assets.paths <<
    Rails.root.join("vendor", "assets", "uswds-0.12.1", p)
end

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( uswds.js )
Rails.application.config.assets.precompile += %w( uswds.css )
