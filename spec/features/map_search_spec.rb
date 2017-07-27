require 'rails_helper'

# rubocop:disable Metrics/BlockLength
RSpec.describe 'The Search', type: :feature, js: true do
  context 'before a search performed' do
    before do
      visit map_path
    end
    it "should have aria labels" do
      expect(page.find('#search-field-small')['aria-labelledby']).to have_content('hubzone-search')
    end
    it "should have autofocus" do
      expect(page.find('#search-field-small')['autofocus']).to be_truthy
    end
    it "should have a tab index" do
      expect(page.find('#search-field-small')['tabindex']).to eq('1')
    end
  end

  required_fields = {
    qct: %w[tract_fips county state],
    qct_e: %w[tract_fips county state],
    qct_r: %w[tract_fips county state],
    qnmc: %w[county_fips county state],
    qnmc_a: %w[county_fips county state],
    qnmc_b: %w[county_fips county state],
    qnmc_c: %w[county_fips county state],
    qnmc_ab: %w[county_fips county state],
    qnmc_r: %w[county_fips county state],
    indian_lands: %w[name census type class gnis],
    brac: %w[brac_sba_name fac_type effective],
    qct_brac: %w[brac_sba_name fac_type effective tract_fips county state],
    qnmc_brac: %w[brac_sba_name fac_type effective county_fips county state],
    qct_qda: %w[incident_description qda_declaration qda_designation qda_publish tract_fips county state],
    qnmc_qda: %w[incident_description qda_declaration qda_designation qda_publish county_fips county state]
  }

  test_queries = {
    qualified_single: {
      search: 'navajo',
      response: {
        formatted_address: 'Yup',
        http_status: 200,
        hubzone: [
          {
            hz_type: "indian_lands",
            expires: nil,
            name: "Navajo Nation AZ",
            census: "042430R",
            type: "Reservation",
            class: "American Indian Area",
            gnis: "42999"
          }
        ],
        geometry: {
          location: {
            lat: 0,
            lng: 0
          }
        },
        query_date: '2017-04-18'
      },
      status: "hubzone_assertions.qualified"
    },
    qualified_expired: {
      search: 'rockcastle, ky',
      response: {
        formatted_address: 'Rockcastle County, KY, USA',
        http_status: 200,
        hubzone: [
          {
            hz_type: "qct_e",
            expires: Date.tomorrow,
            tract_fips: "21203950111",
            county: "Rockcastle County",
            state: "KY"
          },
          {
            hz_type: "qnmc_r",
            expires: Date.today.last_week
          }
        ],
        geometry: {
          location: {
            lat: 0,
            lng: 0
          }
        },
        query_date: '2017-04-18'
      },
      status: "hubzone_assertions.qualified"
    },
    not_qualified: {
      search: "banana",
      response: {
        formatted_address: "Banana QLD 4702, Australia",
        http_status: 200,
        hubzone: [],
        geometry: {
          location: {
            lat: 0,
            lng: 0
          }
        },
        query_date: '2017-04-18'
      },
      status: "hubzone_assertions.not_qualified"
    }
  }

  context "doing a search", vcr: true do
    before do
      visit map_path
    end

    test_queries.map do |hztype, tquery|
      context "with #{hztype} query" do
        before do
          Excon.stub({}, body: tquery[:response].to_json)
          fill_in 'search', with: tquery[:search]
          click_button 'hubzone-search-button'
        end

        after(:all) do
          Excon.stubs.clear
        end

        it "should show the correct designation status" do
          expect(page).to have_content(t(tquery[:status]))
        end

        it "should have the correct formatted_address" do
          expect(page).to have_content(tquery[:formatted_address])
        end

        it "should provide a clear search button" do
          expect(page).to have_css(".clear-search")
        end

        it "should display the date of the search" do
          expect(page).to have_content(t('hubzone_assertions.qualifications_effective') + I18n.l(Date.new(2017, 4, 18), format: :full))
        end

        context "for any hubzone designations" do
          before do
            find('.additional-details-expand').click
          end

          tquery[:response][:hubzone].each do |hubzone|
            it "should contain the correct hubzone assertions" do
              expect(page).to have_content(t("hubzone_assertions." + hubzone[:hz_type].to_s))
            end
            it "should have the right layer symbology" do
              expect(page).to have_css(".layer-" + tquery[:response][:hubzone][0][:hz_type])
            end

            context "should contain the correct columns for #{hubzone[:hz_type]}" do
              req_details = required_fields[hubzone[:hz_type].to_sym]
              req_details.each do |detail|
                it "should contain the correct data for #{detail}" do
                  expect(page).to have_content(hubzone[detail])
                end
              end
            end

            next unless hubzone[:expires]
            it "should show the correct language for expires or expired if expiration date is present" do
              expect(page).to have_content(hubzone[:expires] < Date.today ? t('hubzone_assertions.expired') : t('hubzone_assertions.expires'))
            end
          end
        end
      end
    end
  end
end
