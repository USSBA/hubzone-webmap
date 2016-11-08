require 'rails_helper'

test_data = {
  empty_search: '',
  is_hubzone_request: 'navajo',
  is_not_hubzone_request: '8 Market place'
}

RSpec.describe MapController, type: :controller do
  describe 'GET search' do
    context 'empty or no query provided' do
      it "should have http error status" do
        get :search
        body = JSON.parse response.body
        expect(body['http_status']).to eql(400)
      end
    end
    context 'valid hubzone query' do
      it "should return hubzone status" do
        get :search, {params: {q: test_data[:is_hubzone_request]}}
        body = JSON.parse response.body
        expect(body['hubzone'][0]['hz_type']).to eql('indian_lands')
      end
    end
    context 'invalid hubzone query' do
      it "should return empty hubzone array" do
        get :search, q: :banana
        body = JSON.parse response.body
        expect(body['hubzone']).to eql([])
      end
    end
  end
end
