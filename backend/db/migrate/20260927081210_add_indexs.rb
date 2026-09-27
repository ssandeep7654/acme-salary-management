class AddIndexs < ActiveRecord::Migration[7.0]
  def change
    add_index :employees, :employee_code, unique: true
    add_index :employees, :email, unique: true
    add_index :employees, :country
    add_index :employees, :department
    add_index :employees, :employment_status
    add_index :employees, :current_salary

    add_index :salary_histories,
              [:employee_id, :effective_from]
  end
end
