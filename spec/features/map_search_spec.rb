require 'rails_helper'

# rubocop:disable Metrics/BlockLength, RSpec/ContextWording, RSpec/NestedGroups
RSpec.describe 'The Search', type: :feature, js: true do
  context 'before a search performed' do
    before do
      visit map_path
    rescue Capybara::CapybaraError
      skip "skip until we figure out why the webdriver is randomly failing"
    end

    it "will have aria labels" do
      expect(page.find('#search-field-small')['aria-labelledby']).to have_content('hubzone-search')
    end
    it "will have autofocus" do
      expect(page.find('#search-field-small')['autofocus']).to be_truthy
    end
    it "will have a tab index" do
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
    qnmc_ac: %w[county_fips county state],
    qnmc_bc: %w[county_fips county state],
    qnmc_abc: %w[county_fips county state],
    qnmc_r: %w[county_fips county state],
    indian_lands: %w[name census type class gnis],
    brac: %w[brac_sba_name fac_type effective],
    qct_brac: %w[brac_sba_name fac_type effective tract_fips county state],
    qnmc_brac: %w[brac_sba_name fac_type effective county_fips county state],
    qct_qda: %w[incident_description qda_declaration qda_designation qda_publish tract_fips county state],
    qnmc_qda: %w[incident_description qda_declaration qda_designation qda_publish county_fips county state]
  }

  test_queries = {
    not_qualified_single_quotes_in_response: {
      search: 'Goddard Space Flight Center',
      response: {
        address_components: [{"long_name" => "272", "short_name" => "272", "types" => %w[street_number]},
                             {"long_name" => "Goddard Space Flight Ctr", "short_name" => "Goddard Space Flight Ctr", "types" => %w[route]},
                             {"long_name" => "Greenbelt", "short_name" => "Greenbelt", "types" => %w[locality political]},
                             {"long_name" => "Berwyn", "short_name" => "21, Berwyn", "types" => %w[administrative_area_level_3 political]},
                             {"long_name" => "Prince George's County", "short_name" => "Prince George's County", "types" => %w[administrative_area_level_2 political]},
                             {"long_name" => "Maryland", "short_name" => "MD", "types" => %w[administrative_area_level_1 political]},
                             {"long_name" => "United States", "short_name" => "US", "types" => %w[country political]},
                             {"long_name" => "20771", "short_name" => "20771", "types" => %w[postal_code]},
                             {"long_name" => "20771", "short_name" => "20771", "types" => %w[postal_code]},
                             {"long_name" => "The Banana's Last Stand", "short_name" => "The Banana's Last Stand", "types" => %w[test]},
                             {"long_name" => "0001", "short_name" => "0001", "types" => %w[postal_code_suffix]}],
        formatted_address: "272 Goddard Space Flight Ctr, Greenbelt, MD 20771, USA",
        geometry: { "location" => {"lat" => 38.9950396, "lng" => -76.8567467},
                    "location_type" => "ROOFTOP",
                    "viewport" => {"northeast" => {"lat" => 38.9963885802915, "lng" => -76.8553977197085}, "southwest" => {"lat" => 38.9936906197085, "lng" => -76.85809568029151}}},
        place_id: "ChIJ2e79VCjCt4kRsVq9cN6yrto",
        types: %w[establishment library point_of_interest],
        http_status: 200,
        hubzone: [],
        other_information: {
          alerts: {}
        },
        until_date: nil,
        query_date: "2017-08-03",
        search_q: "Goddard Space Flight Center Library, Greenbelt, MD, United States",
        search_latlng: nil,
        api_version: 1,
        jump: true
      },
      status: "hubzone_assertions.not_qualified"
    },
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
        other_information: {
          alerts: {}
        },
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
            expires: Time.zone.today.last_week
          }
        ],
        other_information: {
          alerts: {}
        },
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
        other_information: {
          alerts: {}
        },
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

  context "doing a search" do
    before do
      visit map_path
    rescue Capybara::CapybaraError
      skip "skip until we figure out why the webdriver is randomly failing"
    end

    test_queries.map do |hztype, tquery|
      context "with #{hztype} query" do
        before do
          Excon.stub({}, body: tquery[:response].to_json)
          fill_in 'search', with: tquery[:search]
          click_button 'hubzone-search-button'
        end

        after do
          Excon.stubs.clear
        end

        it "will show the correct designation status" do
          expect(page).to have_content(t(tquery[:status]))
        end

        it "will have the correct formatted_address" do
          expect(page).to have_content(tquery[:formatted_address])
        end

        it "will provide a clear search button" do
          expect(page).to have_css(".clear-search")
        end

        it "will display the date of the search" do
          expect(page).to have_content(t('hubzone_assertions.qualifications_effective') + I18n.l(Date.parse(tquery[:response][:query_date]), format: :full))
        end

        context "for any hubzone designations" do
          before do
            find('.additional-details-expand').click
          end

          tquery[:response][:hubzone].each do |hubzone|
            it "will contain the correct hubzone assertions" do
              expect(page).to have_content(t("hubzone_assertions." + hubzone[:hz_type].to_s))
            end
            it "will have the right layer symbology" do
              expect(page).to have_css(".layer-" + tquery[:response][:hubzone][0][:hz_type])
            end

            context "will contain the correct columns for #{hubzone[:hz_type]}" do
              req_details = required_fields[hubzone[:hz_type].to_sym]
              req_details.each do |detail|
                it "will contain the correct data for #{detail}" do
                  expect(page).to have_content(hubzone[detail])
                end
              end
            end

            next unless hubzone[:expires]
            it "will show the correct language for expires or expired if expiration date is present" do
              expect(page).to have_content(hubzone[:expires] < Time.zone.today ? t('hubzone_assertions.expired') : t('hubzone_assertions.expires'))
            end
          end
        end
      end
    end
  end
end
# rubocop:enable Metrics/BlockLength, RSpec/ContextWording, RSpec/NestedGroups
