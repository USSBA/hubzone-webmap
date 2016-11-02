require 'rails_helper'

describe "the sidebar should load and have a button", type: :feature do
  before do
    visit('/map')
  end
  it "should have a sidebar" do
    expect(page).to have_selector('sidebar')
  end
  it "should have a sidebar button" do
    expect(page).to have_selector('sidebar-button')
  end
end