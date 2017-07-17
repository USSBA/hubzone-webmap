require 'rails_helper'

# rubocop:disable Metrics/BlockLength
describe "The Sidebar", type: :feature do
  queries = { qualified_multiple: 'navajo',
              qualified_single: 'tiffany peak, co',
              non_qualified: 'banana',
              intersection: '25th & st. paul, baltimore',
              redesignated: 'reform, al' }

  responses = { qualified_multiple: { formatted_address: 'Yup',
                                      http_status: 200,
                                      hubzone: [
                                        {
                                          hz_type: "indian_lands"
                                        },
                                        {
                                          hz_type: "qct"
                                        }
                                      ],
                                      geometry: {
                                        location: {
                                          lat: 0,
                                          lng: 0
                                        }
                                      } },
                non_qualified: { formatted_address: "Nope",
                                 http_status: 200,
                                 hubzone: [],
                                 geometry: {
                                   location: {
                                     lat: 0,
                                     lng: 0
                                   }
                                 } },
                intersection: { formatted_address:
                                'St Paul St & E 25th St, Baltimore, MD 21218, USA',
                                http_status: 200,
                                hubzone: [],
                                geometry: {
                                  location: {
                                    lat: 0,
                                    lng: 0
                                  }
                                } },
                redesignated: { formatted_address:
                                'Reform, AL',
                                http_status: 200,
                                hubzone: [],
                                until_date: Date.today.last_week,
                                geometry: {
                                  location: {
                                    lat: 0,
                                    lng: 0
                                  }
                                } } }

  before do
    visit(map_path)
  end

  after(:all) do
    Excon.stubs.clear
  end

  context "before any interactions" do
    it "should exist and be hidden" do
      expect(page).to have_css("#sidebar.hidden")
    end
    it "should show hubzone qualification with aria label and tab index" do
      expect(page).to have_css("#hubzone-status")
      expect(page.find('#hubzone-status')['aria-label']).to be_truthy
      expect(page.find('#hubzone-status')['tabindex']).to be_truthy
    end
    it "should have as-of date with tab index" do
      expect(page).to have_css(".hubzone-status-date")
      expect(page.find('.hubzone-status-date')['tabindex']).to be_truthy
    end
    it "should have additional details title" do
      expect(page).to have_content("Designations")
    end
    it "should have until date" do
      expect(page).to have_css(".hubzone-until-date")
    end
  end

  context "after a search performed", js: true do
    before do
      Excon.stub({},
                 body: responses[:non_qualified].to_json)
    end
    it "should have a report button" do
      fill_in 'search', with: queries[:non_qualified]
      click_button "hubzone-search-button"
      expect(page).to have_css('#map-report')
    end

    it "should have a share button" do
      fill_in 'search', with: queries[:non_qualified]
      click_button "hubzone-search-button"
      expect(page).to have_css('#map-share')
    end

    it "should be visible" do
      click_button "hubzone-search-button"
      expect(page).not_to have_css("#sidebar.hidden")
    end
    it "should move the zoom controls out" do
      fill_in 'search', with: queries[:non_qualified]
      click_button "hubzone-search-button"
      expect(page).to have_css(".gm-sidebar-on")
    end
    it "...and back in" do
      expect(page).not_to have_css(".gm-sidebar-on")
    end
  end

  context "share button actions", js: true do
    before do
      Excon.stub({},
                 body: responses[:non_qualified].to_json)
      fill_in 'search', with: queries[:non_qualified]
      click_button "hubzone-search-button"
    end

    context "on load / closed" do
      it "should not be visible by default" do
        expect(page).to have_css('.share-map-card', visible: false)
      end
    end
    context "when opened" do
      before do
        click_button "map-share"
      end
      it "should be visible after button click" do
        expect(page).to have_css('.share-map-card', visible: true)
      end
      it "should show the clipboard button" do
        expect(page).to have_css('button.copy-to-clipboard', visible: true)
      end
      it "should have the location url in the input field" do
        expect(page.find("input.share-map-url").value).to eq(current_url)
      end
    end
  end

  context "with a non-qualified address", js: true do
    before do
      Excon.stub({},
                 body: responses[:non_qualified].to_json)
      fill_in 'search', with: queries[:non_qualified]
      click_button 'hubzone-search-button'
    end
    it "should show no qualifications" do
      expect(page).not_to have_css("#qct_e", visible: false)
    end
    it "should not have additional details" do
      expect(page).not_to have_content('Designations')
    end
    it "should not have show details" do
      expect(page).not_to have_content('Show Details')
    end
  end

  context "with a qualified address", js: true do
    before do
      Excon.stub({},
                 body: responses[:qualified_multiple].to_json)
      fill_in 'search', with: queries[:qualified_single]
      click_button 'hubzone-search-button'
    end
    it "should show one qualification" do
      expect(page).to have_css("#indian_lands", visible: false)
    end
    it "should have additional details" do
      expect(page).to have_content('Designations')
    end
    it "should have show details" do
      expect(page).to have_content('Show Details')
    end
  end

  context "with a recently expired date that has not been updated on the map", js: true do
    before do
      Excon.stub({},
                 body: responses[:redesignated].to_json)
      fill_in 'search', with: queries[:redesignated]
      click_button 'hubzone-search-button'
    end
    it "should show Not Qualified" do
      expect(page).to have_content('Not Qualified')
    end
    it "should show correct expired/until language" do
      expect(page).to have_content('expired')
    end
    it "should show correct icon" do
      expect(page).to have_css('.fa-times-circle-o')
    end
    it "should have Designations still shown" do
      expect(page).to have_content('Designations')
    end
  end
end
