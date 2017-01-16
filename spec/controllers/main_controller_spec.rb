require "rails_helper"

RSpec.describe MainController do
  describe "root path" do
    subject { get :index }

    it "should redirect to the map path" do
      expect(subject).to redirect_to(map_url)
    end
  end
end
