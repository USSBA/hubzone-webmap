require "rails_helper"

# rubocop:disable Metrics/BlockLength
RSpec.describe MainController do
  describe "root path" do
    before do
      ENV['HUBZONE_MAP_HOST'] = 'http://foo.bar'
    end
    subject { get :index }

    it "will redirect to the map path" do
      url = "#{ENV['HUBZONE_MAP_HOST']}#{map_path}"
      is_expected.to redirect_to(url)
    end
  end
  describe 'GET with a locale' do
    context 'when given the dev locale' do
      before do
        get :index, params: { locale: :dev }
      end
      it 'will set to the dev locale' do
        expect(I18n.locale).to be(:dev)
      end
    end
    context 'when given the en locale' do
      before do
        get :index, params: { locale: :en }
      end
      it 'will set to the dev locale' do
        expect(I18n.locale).to be(:en)
      end
    end
    context 'when given no locale' do
      before do
        get :index
      end
      it 'will set to the default locale' do
        expect(I18n.locale).to be(I18n.default_locale)
      end
    end
    context 'when given an invalid locale' do
      before do
        get :index, params: { locale: :kjahdsf }
      end
      it 'will set to the default en locale' do
        expect(I18n.locale).to be(I18n.default_locale)
      end
    end
  end
end
# rubocop:enable Metrics/BlockLength
