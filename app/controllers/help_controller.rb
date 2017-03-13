class HelpController < ApplicationController
  def index
    @page_type = params[:page]
  end
end
