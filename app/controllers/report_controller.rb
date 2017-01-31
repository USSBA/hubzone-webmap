require 'excon'
require 'uri'

class ReportController < ApplicationController
  def index
  end

  def report
    query = format_query_string params
    path = "#{MAP_CONFIG[:hubzone_api_report_path]}?#{query}"
    response = connection.request(method: :get,
                                  path: path)
    if response.status == 200
      send_data response.body, :type => "application/pdf", 
                               :filename => "hubzone_assertion_report.pdf",
                               :disposition => "inline"
    else
      send_data :message => 'bad request', :status => 400
    end
  end

  def format_query_string(params)
    "latlng=#{params[:latlng]}&zoom=#{params[:zoom]}&formatted_address=#{params[:formatted_address]}"
  end

  private

  def connection
    Excon.new(MAP_CONFIG[:hubzone_report_host])
  end
end
