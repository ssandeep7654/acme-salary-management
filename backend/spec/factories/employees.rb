FactoryBot.define do
  factory :employee do
    sequence(:employee_code) { |n| "EMP-TEST-%05d" % n }
    first_name { "Jane" }
    last_name { "Doe" }
    sequence(:email) { |n| "jane.doe.#{n}@example.com" }
    country { "United States" }
    department { "Engineering" }
    job_title { "Software Engineer" }
    employment_status { "active" }
    current_salary { 120000 }
    currency { "USD" }
    gender { "Female" }
    hire_date { Date.today - 2.years }
    performance_rating { 4 }
  end
end
