require 'rails_helper'

describe "the map", js: true, type: :feature do
  before do
    visit('/map')
  end
  it "should have google map elements" do
    expect(page).to have_selector('.gmnoprint')
    # save_and_open_screenshot('screenshot.png')
  end
  it "should have geolocation button" do
    expect(page).to have_selector('#geolocation')
  end
end
