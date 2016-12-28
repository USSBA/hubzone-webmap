require 'rails_helper'

describe 'Map search', type: :feature, js: true do
  queries = { qualified: 'navajo',
              non_qualified: 'banana',
              intersection: '25th & st. paul, baltimore' }

  responses = { qualified: { formatted_address: 'Yup',
                             hubzone: [ "yup" ] },
                non_qualified: { formatted_address: "Nope",
                                 hubzone: [] },
                intersection: { formatted_address:
                                'St Paul St & E 25th St, Baltimore, MD 21218, USA',
                                hubzone: [] } }
  statuses = { qualified: 'Qualified HUBZone',
               non_qualified: 'Not Qualified' }

  before do
    visit root_path
  end

  after(:each) do
    Excon.stubs.clear
  end

  context 'with qualified hubzone query' do
    before do
      Excon.stub({},
                 body: responses[:qualified].to_json)
    end
    it "should return qualified hubzone status" do
      fill_in 'search', with: queries[:qualified]
      click_button 'hubzone-search-button'
      expect(page).to have_content(statuses[:qualified])
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
