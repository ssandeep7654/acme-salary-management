FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@acme-corp.com" }
    password { "password123" }
    password_confirmation { "password123" }
    role { "hr_manager" }
  end
end
