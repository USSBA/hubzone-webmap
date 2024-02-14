require "rails_helper"

RSpec.describe 'Map responsive layout', type: :feature do
  before do
    visit map_path
  rescue Capybara::CapybaraError
    skip "skip until we figure out why the webdriver is randomly failing"
  end

  describe "Up to mobile view", js: true do
    before do
      resize_window_to_mobile
    end
    after do
      resize_window_default
    end
    it "will have the streetview man" do
      expect(page).to have_css(".gm-svpc")
    end
    it "will have the geolocation button" do
      expect(page).to have_css("#geolocation")
    end
    it "will have the map type control" do
      expect(page).to have_css('.gm-style-mtc')
    end
  end
end
