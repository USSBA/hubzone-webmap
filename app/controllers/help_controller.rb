class HelpController < ApplicationController
  def index
    @page_selected = params[:page]
  end
end
