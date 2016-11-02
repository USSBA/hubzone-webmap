require 'rails_helper'

describe "the header should load with proper title, logo, and links", type: :feature do
  before do
    visit('/map')
  end
  it "should have copy in the U.S. Official Website header" do
    expect(page).to have_content 'The .gov means it’s official.'
  end
  it "should have header section" do
    expect(page).to have_selector('header')
  end
  it "should have SBA Logo" do
    expect(page.find('#sba-logo')['src']).to have_content 'sba-logo'
  end
  it "should have HUBZone Map title" do
    expect(page).to have_content 'HUBZone Map'
  end
  it "should have HUBZone Program link" do
    expect(page).to have_content 'HUBZone Program'
  end
  it "should have Accessible Version link" do
    expect(page).to have_content 'Accessible Version'
  end
  it "should have Help link" do
    expect(page).to have_content 'Help'
  end
end