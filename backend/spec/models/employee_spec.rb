require 'rails_helper'

RSpec.describe Employee, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      employee = FactoryBot.build(:employee)
      expect(employee).to be_valid
    end

    it 'is invalid without an employee_code' do
      employee = FactoryBot.build(:employee, employee_code: nil)
      expect(employee).not_to be_valid
    end

    it 'is invalid with a duplicate employee_code' do
      FactoryBot.create(:employee, employee_code: "EMP-DUP-01")
      employee = FactoryBot.build(:employee, employee_code: "EMP-DUP-01")
      expect(employee).not_to be_valid
    end

    it 'is invalid without an email' do
      employee = FactoryBot.build(:employee, email: nil)
      expect(employee).not_to be_valid
    end

    it 'is invalid with a duplicate email' do
      FactoryBot.create(:employee, email: "dup@example.com")
      employee = FactoryBot.build(:employee, email: "dup@example.com")
      expect(employee).not_to be_valid
    end

    it 'is invalid with negative salary' do
      employee = FactoryBot.build(:employee, current_salary: -500)
      expect(employee).not_to be_valid
    end
  end

  describe 'methods' do
    let(:employee) { FactoryBot.build(:employee, first_name: "Alice", last_name: "Smith", current_salary: 100000, currency: "USD") }

    it 'returns full_name correctly' do
      expect(employee.full_name).to eq("Alice Smith")
    end

    it 'converts currency to USD equivalent correctly' do
      expect(employee.current_salary_usd).to eq(100000.0)

      inr_emp = FactoryBot.build(:employee, current_salary: 1000000, currency: "INR")
      expect(inr_emp.current_salary_usd).to eq(12000.0)
    end
  end

  describe 'scopes' do
    let!(:active_emp) { FactoryBot.create(:employee, employment_status: "active", country: "United States", department: "Engineering", gender: "Female") }
    let!(:inactive_emp) { FactoryBot.create(:employee, employment_status: "terminated", country: "India", department: "HR", gender: "Male") }

    it 'filters by active status' do
      expect(Employee.active).to include(active_emp)
      expect(Employee.active).not_to include(inactive_emp)
    end

    it 'filters by country' do
      expect(Employee.by_country("India")).to include(inactive_emp)
      expect(Employee.by_country("India")).not_to include(active_emp)
    end

    it 'filters by department' do
      expect(Employee.by_department("Engineering")).to include(active_emp)
      expect(Employee.by_department("Engineering")).not_to include(inactive_emp)
    end
  end
end
