FactoryBot.define do
  factory :salary_history do
    association :employee
    salary { 120000 }
    bonus { 10000 }
    currency { "USD" }
    effective_from { Date.today - 1.year }
    change_reason { "Initial Offer" }
    notes { "Initial compensation package" }
  end
end
