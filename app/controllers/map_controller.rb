# Provides access to the main page with the HUBZone map
require 'excon'

class MapController < ApplicationController
  # def fake
  #   render :layout => false
  # end
  def index
  end

  def search
    query = params[:q]
    response = Excon.get('http://localhost:3001/search?q=' + query)
    status = response.status
    render json: response.body, status: status
  end
end
