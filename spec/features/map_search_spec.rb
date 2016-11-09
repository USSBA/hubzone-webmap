require 'rails_helper'

describe 'Map search', type: :feature, js: true do
  before do
    visit root_path
  end
  context 'with qualified hubzone query' do
    it "should return qualified hubzone status" do
      fill_in 'search', with: 'navajo'
      click_button 'hubzone-search-button'
      expect(page).to have_content('Qualifed HUBZone')
    end
  end
  context 'with non-qualified hubzone query' do
    it "should return non qualified hubzone status" do
      fill_in 'search', with: 'banana'
      click_button 'hubzone-search-button'
      expect(page).to have_content('Not Qualified')
    end
  end
end
