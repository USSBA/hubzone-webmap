require 'rails_helper'

describe "Google Analytics", type: :feature do
  before do
    visit map_path
  end

  context "Header links" do
    links = { title:      { selector: '#logo a.title-link',
                            description: 'Title link' },
              logo:       { selector: '#logo a.logo-link',
                            description: 'Logo link' },
              program:    { selector: 'a#hubzone-program-link',
                            description: 'Program link' },
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
  end
end
