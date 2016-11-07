require 'rails_helper'

describe "the sidebar should load", type: :feature do
  before do
    visit('/map')
  end
  it "should have a sidebar" do
    expect(page).to have_selector(:css, "#sidebar")
  end
end
