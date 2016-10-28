require 'capybara/rspec'

describe "index page", :type => :feature do
  it "homepage has a map div" do
    visit root_path
    expect(page).to have_selector('#map')
  end
  it "map div is not empty" do
    visit root_path
    expect(page).to have_content('.gm-style')
  end

end