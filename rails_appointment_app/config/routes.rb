Rails.application.routes.draw do
  post 'user_token' => 'user_token#create'
  
  resources :users
  resources :rooms
  resources :appointments
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  
  namespace :api do
    get '/eventbrites' => 'events#index_eventbrites'
  end
  
  mount ActionCable.server => '/cable'
end
