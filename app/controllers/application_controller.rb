# 1Parent class of all controllers in the application
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :set_locale

  def set_locale
    return I18n.locale = I18n.default_locale if params[:locale].nil?
    locales = I18n.available_locales
    I18n.locale = if locales.include? params[:locale].to_sym
                    params[:locale]
                  else
                    I18n.default_locale
                  end
  end
end
