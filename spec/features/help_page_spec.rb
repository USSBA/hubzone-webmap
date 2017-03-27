require 'rails_helper'

describe "The Help Page", type: :feature do
  before do
    visit('/hubzone/map/help')
  end
  it "should have a 'Back to map' link " do
    expect(page).to have_css("#back-to-map")
  end
  it "should have a side navigation" do
    expect(page).to have_css(".usa-layout-docs-sidenav")
  end
end
describe "The Help Overview Page", type: :feature do
  before do
    visit('/hubzone/map/help')
  end
  it "should have a title" do
    expect(page).to have_content("HUBZone Map Overview")
  end
  it "should have a Determining Elegibility section" do
    expect(page).to have_css("#section-eligibility")
  end
  it "should have a Providing Documentation to SBA section" do
    expect(page).to have_css("#section-reporting")
  end
  it "should have a Map Legend section" do
    expect(page).to have_css("#section-map-legend")
  end
  it "should have a Advanced Features section" do
    expect(page).to have_css("#section-advanced")
  end
end
describe "The Help FAQ Page", type: :feature do
  before do
    visit('/hubzone/map/help/faq')
  end
  it "should have a title" do
    expect(page).to have_content("Frequently Asked Questions")
  end
end
