# Provides access to the help page with the HUBZone map
class HelpController < ApplicationController
  def index
    @page_selected = params[:page]
  end
end
