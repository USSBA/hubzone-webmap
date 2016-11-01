# Parent class of all controllers in the application
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
end
