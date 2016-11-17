require 'rails_helper'

describe 'Map search', type: :feature, js: true do
  queries = { qualified_multiple: 'navajo',
              qualified_single: 'tiffany peak, co',
              non_qualified: 'banana',
              intersection: '25th & st. paul, baltimore' }

  responses = { qualified_multiple: { formatted_address: 'Yup',
                                      http_status: 200,
                                      hubzone: [
                                        {
                                          hz_type: 'indian_lands'
                                        },
                                        {
                                          hz_type: 'qct'
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
  statuses = { qualified: 'Qualified HUBZone',
               non_qualified: 'Not Qualified' }

  before do
    visit root_path
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
      expect(page).to have_content(statuses[:qualified])
    end
    it "should display indian lands hubzone designation type" do
      fill_in 'search', with: queries[:qualified_multiple]
      click_button 'hubzone-search-button'
      expect(page).to have_content("Qualified by " + responses[:qualified_multiple][:hubzone][0][:hz_type])
    end
    it "should display qct hubzone designation type" do
      fill_in 'search', with: queries[:qualified_multiple]
      click_button 'hubzone-search-button'
      expect(page).to have_content("Qualified by " + responses[:qualified_multiple][:hubzone][1][:hz_type])
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
      expect(page).to have_content(statuses[:non_qualified])
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
