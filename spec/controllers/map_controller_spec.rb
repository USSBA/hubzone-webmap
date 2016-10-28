require 'rails_helper'
require 'capybara/rspec'

RSpec.describe MapController, type: :controller do

  describe "GET #fake" do
    it "returns http success" do
      get :fake
      expect(response).to have_http_status(:success)
    end
  end

end
