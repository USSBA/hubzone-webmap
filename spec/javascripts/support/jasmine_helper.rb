# spec/javascripts/support/jasmine_helper.rb
Jasmine.configure do |config|
  config.random = false
  config.show_console_log = false
  config.stop_spec_on_expectation_failure = false

  config.show_full_stack_trace = false
  config.prevent_phantom_js_auto_install = false
  config.server_port = 8888

  # ci port is random by default
  # config.ci_port = 1234
end
