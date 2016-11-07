describe "the map loads", js: true, type: :feature do
  before do
    visit('/map')
  end
  it "should have google map elements" do
    expect(page).to have_selector('.gmnoprint')
    # save_and_open_screenshot('screenshot.png')
  end
end
