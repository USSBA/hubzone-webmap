describe "index page", js: true, type: :feature do
  it "goes to the home page" do
    visit root_path
    expect(page).to have_content 'Geocoding Results'
    expect(page).to have_content 'Enter a query to geocode'
    #save_and_open_page
    #save_and_open_screenshot
  end
end
