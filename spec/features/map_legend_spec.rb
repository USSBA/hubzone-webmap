require 'rails_helper'

# rubocop:disable Metrics/BlockLength
describe "The Legend", type: :feature do
  before do
    visit('/map')
  end
  it "should have a title" do
    expect(page).to have_content('Legend')
  end
  it "should have a qualification title" do
    expect(page).to have_content('Qualified HUBZones')
  end
  it "should have a expiring title" do
    expect(page).to have_content('Expiring HUBZones')
  end
  it "should have title, toggle, and symbol(s) for qct" do
    expect(page).to have_content('Census Tract')
    expect(page).to have_selector('input#qct')
    expect(page).to have_css('.layer-qct')
  end
  it "should have title, toggle, and symbol(s) for qnmc" do
    expect(page).to have_content('County')
    expect(page).to have_selector('input#qnmc')
    expect(page).to have_css('.layer-qnmc')
  end
  it "should have title, toggle, and symbol(s) for indian_lands" do
    expect(page).to have_content('Indian Land')
    expect(page).to have_selector('input#indian_lands')
    expect(page).to have_css('.layer-indian_lands')
  end
  it "should have title, toggle, and symbol(s) for redesignated" do
    expect(page).to have_content('Redesignated')
    expect(page).to have_selector('input#redesignated')
    expect(page).to have_css('.layer-qct_r')
    expect(page).to have_css('.layer-qnmc_r')
  end
  it "should have title, toggle, and symbol(s) for brac" do
    expect(page).to have_content('Closed Base Area')
    expect(page).to have_selector('input#brac')
    expect(page).to have_css('.layer-qct_b')
    expect(page).to have_css('.layer-qnmc_brac')
    expect(page).to have_css('.layer-brac')
  end
  it "should have title, toggle, and symbol(s) for qda" do
    expect(page).to have_content('Disaster Area')
    expect(page).to have_selector('input#qda')
    expect(page).to have_css('.layer-qct_qda')
    expect(page).to have_css('.layer-qnmc_qda')
  end
end
