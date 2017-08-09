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
  it "should have title for qct" do
    expect(page).to have_content('Census Tract')
  end
  it "should have toggle for qct" do
    expect(page).to have_selector('input#qct')
  end
  it "should have symbol(s) for qct" do
    expect(page).to have_css('.layer-qct')
  end
  it "should have title for qnmc" do
    expect(page).to have_content('County')
  end
  it "should have toggle for qnmc" do
    expect(page).to have_selector('input#qnmc')
  end
  it "should have symbol(s) for qnmc" do
    expect(page).to have_css('.layer-qnmc')
  end
  it "should have title for indian_lands" do
    expect(page).to have_content('Indian Land')
  end
  it "should have toggle for indian_lands" do
    expect(page).to have_selector('input#indian_lands')
  end
  it "should have symbol(s) for indian_lands" do
    expect(page).to have_css('.layer-indian_lands')
  end
  it "should have title for redesignated" do
    expect(page).to have_content('Redesignated')
  end
  it "should have toggle for redesignated" do
    expect(page).to have_selector('input#redesignated')
  end
  it "should have symbol(s) for qct redesignted" do
    expect(page).to have_css('.layer-qct_r')
  end
  it "should have symbol(s) for qnmc redesignted" do
    expect(page).to have_css('.layer-qnmc_r')
  end
  it "should have title for brac" do
    expect(page).to have_content('Closed Base Area')
  end
  it "should have toggle for brac" do
    expect(page).to have_selector('input#brac')
  end
  it "should have symbol(s) for qct brac" do
    expect(page).to have_css('.layer-qct_brac')
  end
  it "should have symbol(s) for qnmc brac" do
    expect(page).to have_css('.layer-qnmc_brac')
  end
  it "should have symbol(s) for qct brac" do
    expect(page).to have_css('.layer-brac')
  end
  it "should have title for qda" do
    expect(page).to have_content('Disaster Area')
  end
  it "should have toggle for qda" do
    expect(page).to have_selector('input#qda')
  end
  it "should have symbol(s) for qct qda" do
    expect(page).to have_css('.layer-qct_qda')
  end
  it "should have symbol(s) for qnmc qda" do
    expect(page).to have_css('.layer-qnmc_qda')
  end
end
