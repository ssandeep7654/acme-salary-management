require 'rails_helper'

RSpec.describe 'Api::V1::Analytics', type: :request do
  before do
    Employee.delete_all
    FactoryBot.create(:employee)
  end

  describe 'GET /api/v1/analytics/overview' do
    it 'returns overview metrics' do
      get '/api/v1/analytics/overview'
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to have_key('total_payroll_usd')
      expect(json).to have_key('gender_pay_equity_ratio')
    end
  end

  describe 'GET /api/v1/analytics/by_country' do
    it 'returns country metrics' do
      get '/api/v1/analytics/by_country'
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to be_an(Array)
    end
  end

  describe 'GET /api/v1/analytics/insights' do
    it 'returns automated HR insights cards' do
      get '/api/v1/analytics/insights'
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json).to be_an(Array)
    end
  end
end
