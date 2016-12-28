require 'excon'
require 'uri'

# Provides access to the main page with the HUBZone map
class MapController < ApplicationController
  # def fake
  #   render :layout => false
  # end
  def index
  end

  def search
    query = URI.encode_www_form("q" => params[:search] ||= ' ')
    response = connection.request(method: :get, path: "/search?#{query}")
    @body = response.data[:body]
    respond_to do |format|
      format.html {}
      format.js {}
    end
  end

  private

  def connection
    if Rails.env == 'test'
      mocked_connection
    else
      Excon.new(MAP_CONFIG[:hubzone_api_host])
    end
  end

  def mocked_connection
    Excon.new(MAP_CONFIG[:hubzone_api_host],
              mock: true, allow_unstubbed_requests: true)
  end
end
