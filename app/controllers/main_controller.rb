# Handles root access
class MainController < ApplicationController
  def index
    redirect_to map_url
  end
end
