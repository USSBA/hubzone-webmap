require 'rails_helper'

describe "the header", type: :feature do
  before do
    visit('/map')
  end
  it "should have Official U.S. Gov website copy" do
    expect(page).to have_content 'An official website of the United States government'
  end
  it "should have header section" do
    expect(page).to have_selector('header')
  end
  it "should have SBA Logo and link to SBA.gov" do
    expect(page.find('#sba-logo')['src']).to have_content 'sba-logo'
    expect(page).to have_css('.logo-link')
  end
  it "should have HUBZone Map title" do
    expect(page).to have_content 'HUBZone Map'
  end
  it "should have HUBZone Program link" do
    expect(page).to have_content 'HUBZone Program'
  end
  it "should have Help link" do
    expect(page).to have_content 'Help'
  end
end
