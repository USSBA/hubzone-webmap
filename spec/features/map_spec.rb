require 'rails_helper'

describe "The HUBZone Map", type: :feature do
  before do
    visit('/map')
  end
  it "will have header section" do
    expect(page).to have_selector('header')
  end
  it "will have overlay for unsupported browsers" do
    expect(page).to have_css(".unsupported-browser")
  end
  it "will have body section" do
    expect(page).to have_selector('body')
  end
  it "will have a search bar" do
    expect(page).to have_selector('#search-field-small')
  end
  it "will have a map div" do
    expect(page).to have_selector('#map')
  end
  it "will have a sidebar" do
    expect(page).to have_selector('#sidebar')
  end
  it "will have a legend" do
    expect(page).to have_selector('#legend')
  end
end
