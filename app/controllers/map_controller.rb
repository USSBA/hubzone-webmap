# Provides access to the main page with the HUBZone map
class MapController < ApplicationController
  # def fake
  #   render :layout => false
  # end
  def index
  end

  def search
    case params[:q]
    when "foo"
      value = { search: "foo", address: "8 Market Place, Baltimore, MD  21202", lat: 36, lon: -76,
                hubzone: [ { type: "indian_lands",
                             indian: "apache",
                             start: "1950-07-10" },
                           { type: "qct",
                             tract: "1283129873",
                             start: "1999-08-30",
                             stop: "2017-04-01" }] }
      stat = :success
    when "bar"
      value = { search: "bar", address: "2403 Pelham Ave", lat: 36, lon: -76,
                hubzone: [] }
      stat = :success
    else
      value = { search: "wtf", address: "road to nowhere", lat: 36, lon: -76,
                hubzone: [] }
      stat = :not_found
    end
    render json: value.to_json, status: stat
  end
end
