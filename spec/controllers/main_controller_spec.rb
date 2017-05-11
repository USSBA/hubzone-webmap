require "rails_helper"

# rubocop:disable Metrics/BlockLength
RSpec.describe MainController do
  describe "root path" do
    before do
      ENV['HUBZONE_MAP_HOST'] = 'http://foo.bar'
    end
    subject { get :index }

    it "should redirect to the map path" do
      url = "#{ENV['HUBZONE_MAP_HOST']}#{map_path}"
      expect(subject).to redirect_to(url)
    end
  end
  describe 'GET with a locale' do
    context 'when given the dev locale' do
      before do
        get :index, params: { locale: :dev }
      end
      it 'should set to the dev locale' do
        expect(I18n.locale).to eql(:dev)
      end
    end
    context 'when given the en locale' do
      before do
        get :index, params: { locale: :en }
      end
      it 'should set to the dev locale' do
        expect(I18n.locale).to eql(:en)
      end
    end
    context 'when given no locale' do
      before do
        get :index
      end
      it 'should set to the default locale' do
        expect(I18n.locale).to eql(I18n.default_locale)
      end
    end
    context 'when given an invalid locale' do
      before do
        get :index, params: { locale: :kjahdsf }
      end
      it 'should set to the default en locale' do
        expect(I18n.locale).to eql(I18n.default_locale)
      end
    end
  end
end
