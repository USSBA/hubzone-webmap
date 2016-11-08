require 'excon'

# Provides access to the main page with the HUBZone map
class MapController < ApplicationController
  # def fake
  #   render :layout => false
  # end
  def index
  end

  def search
    query = params[:q] ||= ''
    response = Excon.get(MAP_CONFIG[:hubzone_api_host] + '/search?q=' + query)
    render json: response.body, status: response.status
  end
end
