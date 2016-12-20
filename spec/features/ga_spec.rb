require 'rails_helper'

describe "Google Analytics", type: :feature do
  before do
    visit map_path
  end

  context "Header links" do
    links = { title:      { selector: '#logo a',
                            description: 'Title link' },
              program:    { selector: 'a#hubzone-program-link',
                            description: 'Program link' },
              accessible: { selector: 'a#hubzone-accessible-link',
                            description: 'Accessible link' },
              help:       { selector: 'a#hubzone-help-link',
                            description: 'Help link' } }

    links.each do |_key, info|
      it "should be ready to send an event for the #{info[:description]} link" do
        link = find(:css, info[:selector])
        expect(link[:onclick]).to match(/HZ.openLink/)
      end
    end
  end

  context "Searching" do
    it "should be ready to send an event when a user searches an address" do
      form = find(:css, 'form.usa-search')
      expect(form[:onsubmit]).to match(/HZ.trackSubmit/)
    end

    xit "should be ready to send an event when a user clicks on the map" do
      # Don't know how to test this since the call to HZ.track is embedded in
      # the JavaScript callback on that action.
    end
  end

  context "Sidebar" do
    xit "should be ready to send an event when a user hides the sidebar" do
      # Don't know how to test this since the call to HZ.track is embedded in
      # the JavaScript callback on that action.
    end
    xit "should be ready to send an event when a user shows the sidebar" do
      # Don't know how to test this since the call to HZ.track is embedded in
      # the JavaScript callback on that action.
    end
    xit "should be ready to send an event when a user expands a qualification" do
      # Don't know how to test this since the call to HZ.track is embedded in
      # the JavaScript callback on that action.
    end
    xit "should be ready to send an event when a user collapses a qualification" do
      # Don't know how to test this since the call to HZ.track is embedded in
      # the JavaScript callback on that action.
    end
  end
end
