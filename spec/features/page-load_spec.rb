require 'capybara/rspec'

describe "the page loads", type: :feature do
  it "goes to the homepage" do
    visit('/')
  end
  it "should have header section" do
    expect(page).to have_selector('header')
  end
  it "should have main section" do
    expect(page).to have_selector('body')
  end
  it "should have a map div" do
    expect(page).to have_selector('#map')
  end
end