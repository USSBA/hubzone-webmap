# Provides a route for the AWS health check
class GovernorsmapController < ApplicationController
  layout "governors"
  def index
    @page_selected = params[:page]
    @version = Version.new
  end
end