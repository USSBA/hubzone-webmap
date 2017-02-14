require 'rails_helper'

# rubocop:disable Metrics/BlockLength
describe 'the map search', type: :feature, js: true do
  queries = { qualified_multiple: 'navajo',
              qualified_single: 'tiffany peak, co',
              non_qualified: 'banana',
              intersection: '25th & st. paul, baltimore' }

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
                                        location:{
                                          lat: 0,
                                          lng: 0
                                        }
                                      },
                                      query_date: Date.today },
                non_qualified: { formatted_address: "Nope",
                                 http_status: 200,
                                 hubzone: [],
                                 geometry: {
                                  location:{
                                    lat: 0,
                                    lng: 0
                                  }
                                }
                              },
                intersection: { formatted_address:
                                'St Paul St & E 25th St, Baltimore, MD 21218, USA',
                                http_status: 200,
                                hubzone: [],
                                geometry: {
                                  location:{
                                    lat: 0,
                                    lng: 0
                                  }
                                } }
                              }
  statuses = { qualified: "hubzone_assertions.qualified",
               non_qualified: "hubzone_assertions.not_qualified" }

  %w(en dev).each do |locale|
    context "in the #{locale} locale" do
      before do
        I18n.locale = locale
        visit map_path(locale: locale)
      end

      after(:each) do
        Excon.stubs.clear
      end

      context 'with qualified hubzone query that has multiple hubzones' do
        before do
          Excon.stub({},
                     body: responses[:qualified_multiple].to_json)
        end
        it "should return qualified hubzone status" do
          fill_in 'search', with: queries[:qualified_multiple]
          click_button 'hubzone-search-button'
          expect(page).to have_content(t(statuses[:qualified]))
        end
        it "should display indian lands hubzone designation type" do
          fill_in 'search', with: queries[:qualified_multiple]
          click_button 'hubzone-search-button'
          expect(page).to have_content(t("hubzone_assertions." + responses[:qualified_multiple][:hubzone][0][:hz_type].to_s))
        end
        it "should display qct hubzone designation type" do
          fill_in 'search', with: queries[:qualified_multiple]
          click_button 'hubzone-search-button'
          expect(page).to have_content(t("hubzone_assertions." + responses[:qualified_multiple][:hubzone][1][:hz_type].to_s))
        end
        it "should display the date of the search" do
          fill_in 'search', with: queries[:qualified_multiple]
          click_button 'hubzone-search-button'
          expect(page).to have_content(I18n.l(Date.today, format: :full))
        end
        it "should provide a clear search button" do
          fill_in 'search', with: queries[:qualified_multiple]
          expect(page).to have_css(".clear-search")
        end
      end

      context 'with non-qualified hubzone query' do
        before do
          Excon.stub({},
                     body: responses[:non_qualified].to_json)
        end
        it "should return non qualified hubzone status" do
          fill_in 'search', with: queries[:non_qualified]
          click_button 'hubzone-search-button'
          expect(page).to have_content(t(statuses[:non_qualified]))
        end
      end

      context 'when searching for intersection' do
        before do
          Excon.stub({},
                     body: responses[:intersection].to_json)
        end
        it "should return the full address of the intersection" do
          fill_in 'search', with: queries[:intersection]
          click_button 'hubzone-search-button'
          expect(page).to have_content(responses[:intersection][:formatted_address])
        end
      end
    end
  end
end
