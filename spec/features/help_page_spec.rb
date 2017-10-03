require 'rails_helper'

# rubocop:disable Metrics/BlockLength
describe "The Help Page", type: :feature do
  MAP_CONFIG[:hubzone_map_version] = {
    major: 100,
    minor: 50,
    patch: 1000,
    pre_release: 'zeta'
  }

  before do
    visit('/hubzone/map/help')
  end
  it "will have a 'Back to map' link " do
    expect(page).to have_css("#back-to-map")
  end
  it "will have a side navigation" do
    expect(page).to have_css(".usa-layout-docs-sidenav")
  end
  it "will have return to top links" do
    expect(page).to have_css(".return-to-top")
  end
  context "The Help Overview Page" do
    before do
      visit('/hubzone/map/help')
    end
    it "will have a title" do
      expect(page).to have_content("HUBZone Map Overview")
    end
    it "will have a Determining Elegibility section" do
      expect(page).to have_css("#section-eligibility")
    end
    it "will have a Providing Documentation to SBA section" do
      expect(page).to have_css("#section-reporting")
    end
    it "will have a Map Legend section" do
      expect(page).to have_css("#section-map-legend")
    end
    it "will have a Advanced Features section" do
      expect(page).to have_css("#section-advanced")
    end
    it "will have a Software Version section" do
      expect(page).to have_css("#section-version")
    end
    it "will show the current version of the map software" do
      expect(page.body).to match(/v\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)? \([a-f0-9]{7}\)/)
    end
  end

  context "The Help FAQ Page" do
    before do
      visit('/hubzone/map/help/faq')
    end
    it "will have a title" do
      expect(page).to have_content("Frequently Asked Questions")
    end
    it "will have question one" do
      expect(page).to have_css("#section-faq-1")
    end
    it "will have question two" do
      expect(page).to have_css("#section-faq-2")
    end
    it "will have question three" do
      expect(page).to have_css("#section-faq-3")
    end
    it "will have question four" do
      expect(page).to have_css("#section-faq-4")
    end
  end
end
