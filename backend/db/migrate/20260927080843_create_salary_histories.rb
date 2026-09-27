class CreateSalaryHistories < ActiveRecord::Migration[7.0]
  def change
    create_table :salary_histories do |t|
      t.references :employee, null: false, foreign_key: true
      t.decimal :salary
      t.string :currency
      t.date :effective_from
      t.date :effective_to

      t.timestamps
    end
  end
end
