require 'rails_helper'

describe "the sidebar", type: :feature do
  before do
    visit('/map')
  end
  context "before any interactions" do
    it "should exist and be hidden" do
      expect(page).to have_css("#sidebar.hidden")
    end
  end
  context "after a search performed", js: true do
    it "should be visible" do
      click_button "hubzone-search-button"
      expect(page).not_to have_css("#sidebar.hidden")
    end
  end
end
