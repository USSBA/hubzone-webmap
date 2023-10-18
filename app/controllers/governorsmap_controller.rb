# Provides access to the help page with the HUBZone map
class GovernorsmapController < ApplicationController
  layout "governors"
  def index
    @page_selected = params[:page]
    @version = Version.new
  end
end

