require 'excon'
require 'uri'

# Provides access to the main page with the HUBZone map
class MapController < ApplicationController
  def index
  end

  def search
    query = format_query params
    response = api_get "#{MAP_CONFIG[:hubzone_api_search_path]}?#{query}"
    body_json = JSON.parse response.data[:body]
    body_json["jump"] = check_jump_param params
    @body = JSON.generate body_json
    @body = @body.gsub("'", "\\\\'")
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

  private

  def check_jump_param(params)
    params[:jump].nil? ? true : params[:jump]
  end

  def api_get(path)
    version = MAP_CONFIG[:hubzone_api_version]
    connection.request(method: :get,
                       path: path,
                       headers: { 'Accept' => "application/sba.hubzone-api.v#{version}" })
  end

  def connection
    @connection ||= Excon.new(MAP_CONFIG[:hubzone_api_host])
  end

  def search_params
    params.permit(:jump, :utf8, :locale, :query_date, :search, :button)
  end
end
