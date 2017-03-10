Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: 'main#index'
  get '/map', to: 'main#index', as: :old_map

  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)

  app_scope = '/hubzone/map'

  scope app_scope do
    get 'search', to: 'map#search'
    get 'translate', to: 'map#translate'
    get 'aws-hc', to: 'health_check#status'
    get 'report', to: 'report#report'
    get '/', to: 'map#index', as: :map
  end
end
