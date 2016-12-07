require 'rails_helper'

describe "the sidebar", type: :feature do
  queries = { qualified_multiple: 'navajo',
            qualified_single: 'tiffany peak, co',
            non_qualified: 'banana' }

  responses = { qualified_multiple: { formatted_address: 'Yup',
                                      http_status: 200,
                                      hubzone: [
                                        {
                                          hz_type: 'Indian Lands'
                                        },
                                        {
                                          hz_type: 'Qualified Census Tract'
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

  context "before any interactions" do
    it "should exist and be hidden" do
      expect(page).to have_css("#sidebar.hidden")
    end
    it "should show qualifications label" do
      expect(page).to have_css("#hubzone-qualifications")
    end
  end
  context "after a search performed", js: true do
    it "should be visible" do
      click_button "hubzone-search-button"
      expect(page).not_to have_css("#sidebar.hidden")
    end
  end
  context "with a non-qualified address", js: true do
    before do
      Excon.stub({},
                 body: responses[:non_qualified].to_json)
    end
    it "should show no qualifications" do
      fill_in 'search', with: queries[:non_qualified]
      click_button 'hubzone-search-button'
      expect(page).not_to have_css("#qct_e")
    end
  end
  context "with a qualified address", js: true do
    before do
      Excon.stub({},
                 body: responses[:qualified_multiple].to_json)
    end
    it "should show one qualification" do
      fill_in 'search', with: queries[:qualified_single]
      click_button 'hubzone-search-button'
      expect(page).to have_css("#indian_lands")
    end
  end
  # context "with a multi-qualified address", js: true do
  #   it "should show multiple qualifications" do
  #     fill_in 'search', with: queries[:qualified_multiple]
  #     click_button 'hubzone-search-button'
  #     expect(page).to have_css("#qct_e")
  #     expect(page).to have_css("#qnmc_e")
  #     expect(page).to have_css("#indian_lands")
  #   end
  # end
end
