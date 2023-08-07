# Provides a route for the AWS health check
class GovernorsController < ApplicationController
  def index
    @page_selected = params[:page]
    @version = Version.new
  end
end
  