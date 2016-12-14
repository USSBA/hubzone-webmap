require 'excon'
require 'uri'

# Provides access to the main page with the HUBZone map
class MapController < ApplicationController
  # def fake
  #   render :layout => false
  # end
  # rubocop:disable Style/EmptyMethod
  def index
  end

  def search
    query = format_query params
    response = connection.request(method: :get,
                                  path: "/search?#{query}")
    @body = response.data[:body]
    respond_to do |format|
      format.js {}
    end
  end

  def format_query(params)
    query = parse_search_query params
    query += "&" + URI.encode_www_form("query_date" => params[:query_date] ||= ' ') if params[:query_date].present?
    query
  end

  def parse_search_query(params)
    if params[:search].present?
      URI.encode_www_form("q" => params[:search] ||= ' ')
    elsif params[:latlng].present?
      URI.encode_www_form("latlng" => params[:latlng] ||= ' ')
    end
  end

  private

  def connection
    Excon.new(MAP_CONFIG[:hubzone_api_host])
  end
end
