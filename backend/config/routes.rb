Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "auth/login", to: "auth#login"
      get "auth/me", to: "auth#me"

      resources :employees do
        collection do
          post :bulk_import
          get :export
        end
        resources :salary_adjustments, only: [:create]
      end

      namespace :analytics do
        get :overview
        get :by_country
        get :by_department
        get :gender_pay_equity
        get :performance_vs_salary
        get :insights
      end
    end
  end

  # Health check endpoint
  get "/up", to: proc { [200, {}, ["OK"]] }
end
