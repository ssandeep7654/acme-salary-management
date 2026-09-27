class CreateEmployees < ActiveRecord::Migration[7.0]
  def change
    create_table :employees do |t|
      t.string :employee_code
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :country
      t.string :department
      t.string :job_title
      t.string :employment_status
      t.decimal :current_salary
      t.string :currency

      t.timestamps
    end
  end
end
