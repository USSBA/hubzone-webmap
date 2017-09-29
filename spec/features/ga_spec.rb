require 'rails_helper'

# rubocop:disable Metrics/BlockLength, Performance/HashEachMethods
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
              help:       { selector: 'a#map-help-guide',
                            description: 'Help Link' } }

    links.each do |_key, info|
      it "will be ready to send an event for the #{info[:description]} link" do
        link = find(:css, info[:selector])
        expect(link[:onclick]).to match(/HZApp.GA.openLink/)
      end
    end
  end

  context "Help links" do
    before do
      visit help_path
    end

    links = { help_overview:  { selector: 'a#help-overview-link',
                                description: 'Help Overview Link' },
              help_faq:       { selector: 'a#help-faq-link',
                                description: 'Help FAQ Link' } }

    links.each do |_key, info|
      it "will be ready to send an event for the #{info[:description]} link" do
        link = find(:css, info[:selector])
        expect(link[:onclick]).to match(/HZApp.GA.openLink/)
      end
    end
  end

  context "Searching" do
    it "will be ready to send an event when a user searches an address" do
      form = find(:css, 'form.usa-search')
      expect(form[:onsubmit]).to match(/HZApp.GA.trackSubmit/)
    end
  end
end
