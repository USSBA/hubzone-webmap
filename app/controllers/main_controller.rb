# Handles root access
class MainController < ApplicationController
  def index
    redirect_to "#{ENV['HUBZONE_MAP_HOST']}#{map_path}"
  end
end
