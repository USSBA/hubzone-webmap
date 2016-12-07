require 'rails_helper'

describe "the sidebar", type: :feature do
  queries = { qualified_multiple: 'navajo',
            qualified_single: 'tiffany peak, co',
            non_qualified: 'banana' }

  before do
    visit('/map')
  end
  context "before any interactions" do
    it "should exist and be hidden" do
      expect(page).to have_css("#sidebar.hidden")
    end
    it "should show qualifications label" do
      expect(page).to have_css("#hubzone-qualifications")
    end
  end
  context "after a search performed", js: true do
    it "should be visible" do
      click_button "hubzone-search-button"
      expect(page).not_to have_css("#sidebar.hidden")
    end
    it "should show no qualifications with a not qualified address" do
      fill_in 'search', with: queries[:non_qualified]
      click_button 'hubzone-search-button'
      expect(page).not_to have_css("#qct_e")
    end
    it "should show one qualification with a single-qualified search" do
      fill_in 'search', with: queries[:qualified_single]
      click_button 'hubzone-search-button'
      puts page.body
      expect(page).to have_css("#indian_lands")
    end
    it "should show multiple qualifications with a multi-qualified search" do
      fill_in 'search', with: queries[:qualified_multiple]
      click_button 'hubzone-search-button'
      expect(page).to have_css("#qct_e")
      expect(page).to have_css("#qnmc_e")
      expect(page).to have_css("#indian_lands")
    end
  end
end
