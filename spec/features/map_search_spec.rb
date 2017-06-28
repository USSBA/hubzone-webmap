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
            gnis: "42851"
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
            tract_fips: "21203950400",
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
    },
    qualified_multiple: {
      search: "tiffany peak, co",
      response: {
        formatted_address: "Tiffany Peak, Colorado 81137, USA",
        http_status: 200,
        hubzone: [
          {
            hz_type: "qct",
            expires: nil,
            tract_fips: "21203950400",
            county: "Rockcastle County",
            state: "KY"
          },
          {
            hz_type: "qnmc",
            expires: nil,
            county_fips: "21203950409",
            county: "Harford County",
            state: "MD"
          },
          {
            hz_type: "brac",
            brac_sba_name: "Central Base",
            fac_type: "Base",
            effective: Date.today
          },
          {
            hz_type: "qct_brac",
            brac_sba_name: "Central Base",
            fac_type: "Base",
            effective: Date.today,
            tract_fips: "21203950400",
            county_name: "Rockcastle County",
            state: "KY"
          },
          {
            hz_type: "qnmc_brac",
            brac_sba_name: "North Base",
            fac_type: "Closed Base",
            effective: Date.today,
            county_fips: "21203950400",
            county_name: "Montgomery County",
            state: "MD"
          },
          {
            hz_type: "qct_qda",
            incident_description: "Tornado",
            qda_declaration: Date.today,
            qda_designation: Date.today,
            qda_publish: Date.today,
            tract_fips: "21203950400",
            county_name: "Rockcastle County",
            state: "KY"
          },
          {
            hz_type: "qnmc_qda",
            incident_description: "Tornado and Earthquake",
            qda_declaration: Date.today,
            qda_designation: Date.today,
            qda_publish: Date.today,
            county_fips: "21203950410",
            county_name: "Murky County",
            state: "KY"
          },
          {
            hz_type: "indian_lands",
            name: "Navajo Nation AZ",
            census: "042430R",
            type: "Reservation",
            class: "American Indian Area",
            gnis: "42851"
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
    }
  }

  %w[en dev].each do |locale|
    context "in the #{locale} locale", vcr: true do
      before do
        I18n.locale = locale
        visit map_path(locale: locale)
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
              click_button 'additional-details-button'
            end

            tquery[:response][:hubzone].each do |hubzone|
              it "should contain the correct hubzone assertions" do
                expect(page).to have_content(t("hubzone_assertions." + hubzone[:hz_type].to_s))
              end
              it "should have the right layer symbology" do
                expect(page).to have_css(".layer-" + tquery[:response][:hubzone][0][:hz_type])
              end
              next unless hubzone[:expires]
              it "should show the correct language for expires or expired if expiration date is present" do
                expect(page).to have_content(hubzone[:expires] < Date.today ? t('hubzone_assertions.expired') : t('hubzone_assertions.expires'))
              end
            end
          end

          context "for designation additional details" do
            before do
              click_button 'additional-details-button'
            end

            next unless tquery[:search] == 'tiffany peak, co'
            it "should have additional details" do
              expect(page).to have_content(tquery[:response][:hubzone][0][:tract_fips])
              expect(page).to have_content(tquery[:response][:hubzone][0][:county])
              expect(page).to have_content(tquery[:response][:hubzone][0][:state])
              expect(page).to have_content(tquery[:response][:hubzone][1][:county_fips])
              expect(page).to have_content(tquery[:response][:hubzone][1][:county])
              expect(page).to have_content(tquery[:response][:hubzone][1][:state])
              expect(page).to have_content(tquery[:response][:hubzone][2][:brac_sba_name])
              expect(page).to have_content(tquery[:response][:hubzone][2][:fac_type])
              expect(page).to have_content(tquery[:response][:hubzone][2][:effective])
              expect(page).to have_content(tquery[:response][:hubzone][3][:brac_sba_name])
              expect(page).to have_content(tquery[:response][:hubzone][3][:fac_type])
              expect(page).to have_content(tquery[:response][:hubzone][3][:effective])
              expect(page).to have_content(tquery[:response][:hubzone][3][:tract_fips])
              expect(page).to have_content(tquery[:response][:hubzone][3][:county_name])
              expect(page).to have_content(tquery[:response][:hubzone][3][:state])
              expect(page).to have_content(tquery[:response][:hubzone][4][:brac_sba_name])
              expect(page).to have_content(tquery[:response][:hubzone][4][:fac_type])
              expect(page).to have_content(tquery[:response][:hubzone][4][:effective])
              expect(page).to have_content(tquery[:response][:hubzone][4][:county_fips])
              expect(page).to have_content(tquery[:response][:hubzone][4][:county_name])
              expect(page).to have_content(tquery[:response][:hubzone][4][:state])
              expect(page).to have_content(tquery[:response][:hubzone][5][:incident_description])
              expect(page).to have_content(tquery[:response][:hubzone][5][:qda_declaration])
              expect(page).to have_content(tquery[:response][:hubzone][5][:qda_designation])
              expect(page).to have_content(tquery[:response][:hubzone][5][:qda_publish])
              expect(page).to have_content(tquery[:response][:hubzone][5][:tract_fips])
              expect(page).to have_content(tquery[:response][:hubzone][5][:county_name])
              expect(page).to have_content(tquery[:response][:hubzone][5][:state])
              expect(page).to have_content(tquery[:response][:hubzone][6][:incident_description])
              expect(page).to have_content(tquery[:response][:hubzone][6][:qda_declaration])
              expect(page).to have_content(tquery[:response][:hubzone][6][:qda_designation])
              expect(page).to have_content(tquery[:response][:hubzone][6][:qda_publish])
              expect(page).to have_content(tquery[:response][:hubzone][6][:county_fips])
              expect(page).to have_content(tquery[:response][:hubzone][6][:county_name])
              expect(page).to have_content(tquery[:response][:hubzone][6][:state])
              expect(page).to have_content(tquery[:response][:hubzone][7][:name])
              expect(page).to have_content(tquery[:response][:hubzone][7][:census])
              expect(page).to have_content(tquery[:response][:hubzone][7][:type])
              expect(page).to have_content(tquery[:response][:hubzone][7][:class])
              expect(page).to have_content(tquery[:response][:hubzone][7][:gnis])
            end
          end
        end
      end
    end
  end
end
