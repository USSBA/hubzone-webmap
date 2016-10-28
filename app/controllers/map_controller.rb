class MapController < ApplicationController
  def fake
    render layout: false
  end

  def googleMapStyleConfig
    render file: "/config/google-maps-style-config.json"
  end
end
