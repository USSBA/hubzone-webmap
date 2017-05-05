# Parent class of all controllers in the application
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :set_locale

  def set_locale
    if (params[:locale] == 'en' || params[:locale] == 'dev') then
      I18n.locale = params[:locale] || I18n.default_locale
    else
      I18n.locale = I18n.default_locale
    end
  end
end
