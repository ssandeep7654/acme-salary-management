class SalaryHistory < ApplicationRecord
  belongs_to :employee

  validates :salary, numericality: { greater_than_or_equal_to: 0 }
  validates :currency, :effective_from, presence: true

  default_scope { order(effective_from: :desc) }
end