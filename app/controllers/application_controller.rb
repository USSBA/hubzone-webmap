# Parent class of all controllers in the application
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :set_locale

  def set_locale
    locales = %w(en dev)
    I18n.locale = if locales.include? params[:locale]
                    params[:locale]
                  else
                    I18n.default_locale
                  end
  end
end
