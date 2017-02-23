require "rails_helper"

RSpec.describe MapController do
  describe "parses latlng queries" do
    context "when given a latlng request"
    query = MapController.new.parse_search_query(latlng: "35.86456960744962,-97.87994384765625")
    it "should be URI parsed" do
      expect(query).to eq "latlng=35.86456960744962%2C-97.87994384765625"
    end
  end
  describe "parse text search" do
    context "when given a text request"
    query = MapController.new.parse_search_query(search: "8 market place baltimore md")
    it "should be URI parsed" do
      expect(query).to eq "q=8+market+place+baltimore+md"
    end
  end
end
