require 'rails_helper'

RSpec.describe SalaryAnalyticsService, type: :service do
  before do
    SalaryHistory.delete_all
    Employee.delete_all

    @emp1 = FactoryBot.create(:employee, gender: "Female", current_salary: 100000, currency: "USD", department: "Engineering", country: "United States", performance_rating: 5)
    @emp2 = FactoryBot.create(:employee, gender: "Male", current_salary: 120000, currency: "USD", department: "Engineering", country: "United States", performance_rating: 4)
    @emp3 = FactoryBot.create(:employee, gender: "Female", current_salary: 80000, currency: "USD", department: "Sales", country: "United Kingdom", performance_rating: 3)
  end

  describe '.overview' do
    it 'calculates overview analytics correctly' do
      res = SalaryAnalyticsService.overview
      expect(res[:total_employees]).to eq(3)
      expect(res[:total_payroll_usd]).to eq(300000.0)
      expect(res[:average_salary_usd]).to eq(100000.0)
      expect(res[:median_salary_usd]).to eq(100000.0)
    end
  end

  describe '.by_department' do
    it 'groups analytics by department' do
      res = SalaryAnalyticsService.by_department
      eng = res.find { |d| d[:department] == "Engineering" }
      expect(eng[:employee_count]).to eq(2)
      expect(eng[:total_spend_usd]).to eq(220000.0)
    end
  end

  describe '.gender_pay_equity' do
    it 'returns gender pay gap details' do
      res = SalaryAnalyticsService.gender_pay_equity
      expect(res[:departments]).not_to be_empty
    end
  end

  describe '.insights' do
    it 'returns HR insights cards' do
      res = SalaryAnalyticsService.insights
      expect(res.size).to be >= 4
    end
  end
end
