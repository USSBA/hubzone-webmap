require 'rails_helper'

describe "the map", type: :feature do
  before do
    visit('/map')
  end
  it "should have report button" do
    expect(page).to have_selector('#map-report')
  end
end
