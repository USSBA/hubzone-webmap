Rails.application.routes.draw do
  get 'map/fake'

  root 'map#fake'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
