describe "index page", :type => :feature do
  it "goes to the home page" do
    visit root_path
    expect(page).to have_content 'Geocoding Results'
    expect(page).to have_content 'Enter a query to geocode'
  end
end
