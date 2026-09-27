require 'rails_helper'

RSpec.describe SalaryHistory, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      history = FactoryBot.build(:salary_history)
      expect(history).to be_valid
    end

    it 'is invalid without currency' do
      history = FactoryBot.build(:salary_history, currency: nil)
      expect(history).not_to be_valid
    end

    it 'is invalid with negative salary' do
      history = FactoryBot.build(:salary_history, salary: -100)
      expect(history).not_to be_valid
    end
  end
end
