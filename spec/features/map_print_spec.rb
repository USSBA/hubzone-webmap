require 'rails_helper'

describe "the page when printing", js: true, type: :feature do

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
                                      geometry: {} },
                non_qualified: { formatted_address: "Nope",
                                 http_status: 200,
                                 hubzone: [],
                                 geometry: {} },
                intersection: { formatted_address:
                                'St Paul St & E 25th St, Baltimore, MD 21218, USA',
                                http_status: 200,
                                hubzone: [],
                                geometry: {} } }
  before do
    visit('/map')
  end
  it "should have a print button" do
    expect(page).to have_selector('#map-print')
  end
  it "should add map classes" do
    click_on 'map-print'
    expect(page).to have_selector('.printable-map')
  end
  context " and provided a known good layout image" do
    before do
      Excon.stub({},
                 body: responses[:qualified_multiple].to_json)
    end
    it "should match the layout" do
      fill_in 'search', with: queries[:qualified_multiple]
      click_button 'hubzone-search-button'
      click_on 'map-print'
      sleep(10)
      page.save_screenshot('test_screenshot.png')
    end
  end
end
