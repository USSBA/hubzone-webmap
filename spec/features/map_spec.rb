require 'rails_helper'

describe "The HUBZone Map", type: :feature do
  before do
    visit('/map')
  end
  it "should have header section" do
    expect(page).to have_selector('header')
  end
  it "should have overlay for unsupported browsers" do
    expect(page).to have_css(".unsupported-browser")
  end
  it "should have body section" do
    expect(page).to have_selector('body')
  end
  it "should have a search bar" do
    expect(page).to have_selector('#search-field-small')
  end
  it "should have a map div" do
    expect(page).to have_selector('#map')
  end
  it "should have a sidebar" do
    expect(page).to have_selector('#sidebar')
  end
  it "should have a legend" do
    expect(page).to have_selector('#legend')
  end
end
