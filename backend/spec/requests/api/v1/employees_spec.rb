require 'rails_helper'

RSpec.describe 'Api::V1::Employees', type: :request do
  before do
    Employee.delete_all
    @employee = FactoryBot.create(:employee, first_name: "Sarah", last_name: "Connor", department: "Engineering", country: "United States")
  end

  describe 'GET /api/v1/employees' do
    it 'returns paginated employee list' do
      get '/api/v1/employees'
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['employees'].size).to eq(1)
      expect(json['pagination']['total_count']).to eq(1)
    end

    it 'filters by search query' do
      get '/api/v1/employees', params: { query: "Sarah" }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['employees'].size).to eq(1)

      get '/api/v1/employees', params: { query: "Nonexistent" }
      json = JSON.parse(response.body)
      expect(json['employees'].size).to eq(0)
    end
  end

  describe 'GET /api/v1/employees/:id' do
    it 'returns employee detail with salary histories' do
      get "/api/v1/employees/#{@employee.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['employee']['id']).to eq(@employee.id)
    end
  end

  describe 'POST /api/v1/employees' do
    it 'creates a new employee record' do
      params = {
        employee: {
          employee_code: "EMP-NEW-99",
          first_name: "Bruce",
          last_name: "Wayne",
          email: "bruce.wayne@acme-corp.com",
          country: "United States",
          department: "Operations",
          job_title: "Director",
          employment_status: "active",
          current_salary: 250000,
          currency: "USD",
          gender: "Male",
          hire_date: "2023-01-01",
          performance_rating: 5
        }
      }

      post '/api/v1/employees', params: params
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['employee']['first_name']).to eq("Bruce")
    end
  end

  describe 'DELETE /api/v1/employees/:id' do
    it 'deletes employee record' do
      delete "/api/v1/employees/#{@employee.id}"
      expect(response).to have_http_status(:no_content)
    end
  end
end
