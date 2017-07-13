require 'rails_helper'

describe "The Header", type: :feature do
  before do
    visit('/map')
  end
  it "should have Official U.S. Gov website copy" do
    expect(page).to have_content 'An official website of the United States government'
  end
  it "should have SBA Logo with alt and link to SBA.gov" do
    expect(page.find('#sba-logo')['src']).to have_content 'sba-logo'
    expect(page).to have_css('.logo-link')
    expect(page.find('#sba-logo')['alt']).to have_content 'U.S. Small Business Administration logo'
  end
  it "should have HUBZone Map title and aria label" do
    expect(page).to have_content 'HUBZone Map'
    expect(page.find('.title-link')['aria-label']).to have_content 'hubzone map home'
  end
  it "should have a Help link and aria label" do
    expect(page).to have_css('#map-help-guide')
    expect(page.find('#map-help-guide')['aria-label']).to have_content 'Help'
  end
  it "should have HUBZone Program link and aria label" do
    expect(page).to have_content 'HUBZone Program'
    expect(page.find('#hubzone-program-link')['aria-label']).to have_content 'hubzone program'
  end
  it "should have overlay for unsupported browsers" do
    expect(page).to have_css(".unsupported-browser")
  end
end
