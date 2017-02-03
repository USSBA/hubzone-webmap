Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: 'main#index'

  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)

  scope '/map' do
    get 'search', to: 'map#search'
    get 'translate', to: 'map#translate'
    get 'aws-hc', to: 'health_check#status'
    get 'report', to: 'report#report'
    get '/', to: 'map#index', as: :map
  end
end
