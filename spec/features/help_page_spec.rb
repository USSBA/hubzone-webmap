require 'rails_helper'

describe "The Help Page", type: :feature do
  before do
    visit('/map/help')
  end
  it "should have a 'Back to map' link " do
    expect(page).to have_css("#back-to-map")
  end
end
