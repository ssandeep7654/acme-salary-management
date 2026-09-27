require "securerandom"

puts "Starting ACME Salary Management seeding process..."
start_time = Time.now

# Clear existing records
SalaryHistory.delete_all
Employee.delete_all
User.delete_all

# Create HR Manager User
User.create!(
  email: "hr@acme.com",
  password: "password123",
  password_confirmation: "password123",
  role: "hr_manager"
)
puts "Created HR Manager user: hr@acme.com / password123"

COUNTRIES = [
  { name: "United States", currency: "USD", base_min: 65000, base_max: 220000, weight: 35 },
  { name: "United Kingdom", currency: "GBP", base_min: 40000, base_max: 120000, weight: 15 },
  { name: "Germany", currency: "EUR", base_min: 45000, base_max: 115000, weight: 15 },
  { name: "India", currency: "INR", base_min: 700000, base_max: 4200000, weight: 15 },
  { name: "Singapore", currency: "SGD", base_min: 55000, base_max: 160000, weight: 5 },
  { name: "Japan", currency: "JPY", base_min: 5500000, base_max: 16000000, weight: 5 },
  { name: "Canada", currency: "CAD", base_min: 55000, base_max: 150000, weight: 5 },
  { name: "Australia", currency: "AUD", base_min: 60000, base_max: 165000, weight: 5 }
].freeze

DEPARTMENTS = {
  "Engineering" => ["Software Engineer", "Senior Software Engineer", "Staff Engineer", "Engineering Manager", "DevOps Engineer", "QA Engineer"],
  "Product" => ["Associate Product Manager", "Product Manager", "Senior Product Manager", "Director of Product", "UI/UX Designer"],
  "Sales" => ["Account Executive", "Senior Account Executive", "Sales Manager", "Business Development Rep", "VP of Sales"],
  "Marketing" => ["Marketing Specialist", "Content Strategist", "Growth Manager", "SEO Analyst", "VP of Marketing"],
  "HR" => ["HR Specialist", "HR Business Partner", "Talent Acquisition Lead", "Head of People"],
  "Finance" => ["Financial Analyst", "Senior Accountant", "Finance Manager", "Controller"],
  "Operations" => ["Operations Coordinator", "Operations Manager", "Supply Chain Analyst", "Director of Operations"]
}.freeze

FIRST_NAMES_MALE = %w[James John Robert Michael William David Richard Joseph Thomas Charles Christopher Daniel Matthew Anthony Mark Donald Steven Paul Andrew Joshua Kenneth Kevin Brian George Edward Ronald Timothy Jason Jeffrey Ryan Jacob Gary Nicholas Eric Jonathan Stephen Larry Justin Scott Brandon Frank Benjamin Gregory Raymond Samuel Patrick Alexander Jack Dennis Jerry Tyler Aaron Jose Henry Adam Douglas Nathan Peter Zach Noah Ethan Liam Mason Logan Oliver Lucas Henry Jackson Aiden].freeze
FIRST_NAMES_FEMALE = %w[Mary Patricia Jennifer Linda Elizabeth Barbara Susan Jessica Sarah Karen Nancy Lisa Margaret Betty Sandra Ashley Dorothy Kimberly Emily Donna Michelle Carol Amanda Melissa Deborah Stephanie Rebecca Sharon Laura Cynthia Kathleen Amy Shirley Angela Helen Anna Brenda Pamela Nicole Samantha Katherine Christine Debra Rachel Carolyn Janet Catherine Maria Heather Diane Ruth Julie Olivia Emma Ava Sophia Isabella Charlotte Amelia Mia Harper Evelyn Abigail Ella Scarlett Grace Chloe Victoria Riley].freeze
LAST_NAMES = %w[Smith Johnson Williams Brown Jones Garcia Miller Davis Rodriguez Martinez Hernandez Lopez Gonzalez Wilson Anderson Thomas Taylor Moore Jackson Martin Lee Perez Thompson White Harris Sanchez Clark Ramirez Lewis Robinson Walker Young Allen King Wright Scott Torres Nguyen Hill Flores Green Adams Nelson Baker Hall Rivera Campbell Mitchell Carter Roberts Gomez Phillips Evans Turner Diaz Parker Cruz Edwards Collins Reyes Stewart Morris Morales Murphy Cook Rogers Gutierrez Ortiz Morgan Cooper Peterson Bailey Reed Kelly Howard Ramos Kim Cox Ward Richardson Watson Brooks Chavez Wood James Bennett Gray Mendoza Ruiz Hughes Price Alvarez Castillo Sanders Patel Myers Long Ross Foster Washington Coleman Gonzales]

GENDERS = (["Female"] * 48) + (["Male"] * 48) + (["Non-Binary"] * 3) + (["Other"] * 1)
STATUSES = (["active"] * 90) + (["on_leave"] * 6) + (["terminated"] * 4)
REASONS = ["Initial Offer", "Annual Performance Review", "Promotion", "Market Adjustment", "Merit Increase"].freeze

COUNTRY_POOL = COUNTRIES.flat_map { |c| [c] * c[:weight] }

TOTAL_EMPLOYEES = 10_000
BATCH_SIZE = 1_000

now = Time.current
employees_buffer = []
salary_histories_buffer = []

puts "Generating 10,000 employee records..."

ActiveRecord::Base.transaction do
  (1..TOTAL_EMPLOYEES).each do |i|
    gender = GENDERS.sample
    first_name = gender == "Male" ? FIRST_NAMES_MALE.sample : FIRST_NAMES_FEMALE.sample
    last_name = LAST_NAMES.sample
    emp_code = sprintf("EMP-%05d", i)
    email = "#{first_name.downcase}.#{last_name.downcase}.#{i}@acme-corp.com"

    country_info = COUNTRY_POOL.sample
    country = country_info[:name]
    currency = country_info[:currency]

    dept = DEPARTMENTS.keys.sample
    title = DEPARTMENTS[dept].sample

    base_range = country_info[:base_max] - country_info[:base_min]
    current_salary = (country_info[:base_min] + (rand * base_range)).round(-2)

    hire_days_ago = rand(30..2500)
    hire_date = Date.today - hire_days_ago.days
    status = STATUSES.sample
    perf_rating = rand(1..5)

    employees_buffer << {
      id: i,
      employee_code: emp_code,
      first_name: first_name,
      last_name: last_name,
      email: email,
      country: country,
      department: dept,
      job_title: title,
      employment_status: status,
      current_salary: current_salary,
      currency: currency,
      gender: gender,
      hire_date: hire_date,
      performance_rating: perf_rating,
      created_at: now,
      updated_at: now
    }

    hist_count = rand(1..3)
    start_salary = (current_salary * (0.75 + rand * 0.15)).round(-2)
    
    (0...hist_count).each do |h_idx|
      eff_date = hire_date + (h_idx * 365).days
      eff_date = Date.today if eff_date > Date.today
      
      calc_salary = (start_salary * (1 + (h_idx * 0.08))).round(-2)
      calc_salary = current_salary if h_idx == hist_count - 1
      
      bonus = (calc_salary * (rand(0.05..0.15))).round(-2)
      reason = h_idx == 0 ? "Initial Offer" : REASONS[1..-1].sample

      salary_histories_buffer << {
        employee_id: i,
        salary: calc_salary,
        bonus: bonus,
        currency: currency,
        effective_from: eff_date,
        effective_to: (h_idx == hist_count - 1) ? nil : eff_date + 364.days,
        change_reason: reason,
        notes: "System generated historical compensation entry for #{reason.downcase}.",
        created_at: now,
        updated_at: now
      }
    end

    if employees_buffer.size >= BATCH_SIZE
      Employee.insert_all(employees_buffer)
      employees_buffer.clear
      print "."
    end
  end

  if employees_buffer.any?
    Employee.insert_all(employees_buffer)
    employees_buffer.clear
  end

  puts "\nInserting salary histories..."
  salary_histories_buffer.each_slice(BATCH_SIZE) do |slice|
    SalaryHistory.insert_all(slice)
    print "*"
  end
end

elapsed = (Time.now - start_time).round(2)
puts "\nSeeding finished successfully!"
puts "Total Employees created: #{Employee.count}"
puts "Total Salary Histories created: #{SalaryHistory.count}"
puts "Execution time: #{elapsed} seconds"
