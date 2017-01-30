require 'excon'
require 'uri'

# Provides access to the main page with the HUBZone map
class MapController < ApplicationController
  def index
  end

  def search
    query = format_query params
    path = "#{MAP_CONFIG[:hubzone_api_search_path]}?#{query}"
    response = connection.request(method: :get,
                                  path: path)
    @body = response.data[:body]
    respond_to do |format|
      format.js {}
    end
  end

  def format_query(params)
    query = parse_search_query params
    return query if query.nil?

    # Add in the query date if present
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

  # helper route for translating a string - will simply accept a set of parameters and send them right back to the appropirate translate.js.erb templates
  def translate
    @body = params
    respond_to do |format|
      format.js
    end
  end

  private

  def connection
    Excon.new(MAP_CONFIG[:hubzone_api_host])
  end
end
