Rails.application.routes.draw do
  mount JasmineRails::Engine => '/specs' if defined?(JasmineRails)
  #get 'map/fake'

  root to: 'map#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get 'map', to: 'map#index'

end
