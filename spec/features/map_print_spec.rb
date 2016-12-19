require 'rails_helper'

describe "the page when printing", js: true, type: :feature do
  before do
    visit('/map')
  end
  it "should have a print button" do
    expect(page).to have_selector('#map-print')
  end
  # it "should resize the map div" do
  #   click_on 'map-print'
  #   wait(5)
  #   expect(page).to have_selector('.print')
  # end
end

