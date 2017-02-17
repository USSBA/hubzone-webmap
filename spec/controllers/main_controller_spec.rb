require "rails_helper"

RSpec.describe MainController do
  describe "root path" do
    before do
      ENV['HUBZONE_MAP_HOST'] = 'http://foo.bar'
    end
    subject { get :index }

    it "should redirect to the map path" do
      url = "#{ENV['HUBZONE_MAP_HOST']}#{map_path}"
      expect(subject).to redirect_to(url)
    end
  end
end
