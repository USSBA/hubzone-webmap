require 'rails_helper'

describe "the maps legend", type: :feature do
  before do
    visit('/map')
  end
  it "should appear on the map" do
    expect(page).to have_css("#legend")
  end
end
