class AddAnalyticsFieldsToEmployeesAndSalaryHistories < ActiveRecord::Migration[7.0]
  def change
    add_column :employees, :gender, :string, default: "Female"
    add_column :employees, :hire_date, :date
    add_column :employees, :performance_rating, :integer, default: 3

    add_column :salary_histories, :change_reason, :string
    add_column :salary_histories, :bonus, :decimal, default: 0.0
    add_column :salary_histories, :notes, :text

    add_index :employees, :gender
    add_index :employees, :hire_date
    add_index :employees, :performance_rating
  end
end
