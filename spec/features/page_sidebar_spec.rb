require 'rails_helper'

describe "the sidebar", js: true, type: :feature do
  before do
    visit('/map')
  end
  context "before any interactions" do
    it "should exist and be hidden" do
      expect(page).to have_selector("#sidebar", visible: false)
    end
  end
  context "after a search performed" do
    it "should be visible" do
      click_button "hubzone-search-button"
      expect(page).to have_selector("#sidebar", visible: true)
    end
  end
end
