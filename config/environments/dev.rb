# Same settings as production
require Rails.root.join("config", "environments", "development")

Rails.application.configure do
  #Serve up compiled assets
  config.assets.compile = false
  config.assets.debug = false
  config.assets.digest = true

  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger           = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger = ActiveSupport::TaggedLogging.new(logger)
  end
end
