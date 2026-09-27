class Employee < ApplicationRecord
  has_many :salary_histories, dependent: :destroy

  validates :employee_code, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, :last_name, :country, :department, :job_title, :employment_status, :currency, presence: true
  validates :current_salary, numericality: { greater_than_or_equal_to: 0 }
  validates :gender, inclusion: { in: %w[Female Male Non-Binary Other], allow_blank: true }
  validates :performance_rating, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }, allow_nil: true

  scope :active, -> { where(employment_status: "active") }
  scope :by_country, ->(country) { where(country: country) if country.present? }
  scope :by_department, ->(department) { where(department: department) if department.present? }
  scope :by_gender, ->(gender) { where(gender: gender) if gender.present? }
  scope :by_status, ->(status) { where(employment_status: status) if status.present? }
  scope :search_query, ->(q) {
    if q.present?
      term = "%#{q.downcase}%"
      where("LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(employee_code) LIKE ? OR LOWER(job_title) LIKE ?", term, term, term, term, term)
    end
  }

  USD_EXCHANGE_RATES = {
    "USD" => 1.0,
    "EUR" => 1.08,
    "GBP" => 1.28,
    "CAD" => 0.74,
    "AUD" => 0.66,
    "SGD" => 0.75,
    "INR" => 0.012,
    "JPY" => 0.0067
  }.freeze

  def full_name
    "#{first_name} #{last_name}"
  end

  def current_salary_usd
    rate = USD_EXCHANGE_RATES[currency] || 1.0
    (current_salary * rate).round(2)
  end
end