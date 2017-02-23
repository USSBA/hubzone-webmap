# Same settings as production
require Rails.root.join("config/environments/development")

Rails.application.configure do
  #Serve up compiled assets
  config.assets.compile = false
  config.assets.debug = false
  config.assets.digest = true
end
