# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2026_09_27_090000) do
  create_table "employees", force: :cascade do |t|
    t.string "employee_code"
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "country"
    t.string "department"
    t.string "job_title"
    t.string "employment_status"
    t.decimal "current_salary"
    t.string "currency"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "gender", default: "Female"
    t.date "hire_date"
    t.integer "performance_rating", default: 3
    t.index ["country"], name: "index_employees_on_country"
    t.index ["current_salary"], name: "index_employees_on_current_salary"
    t.index ["department"], name: "index_employees_on_department"
    t.index ["email"], name: "index_employees_on_email", unique: true
    t.index ["employee_code"], name: "index_employees_on_employee_code", unique: true
    t.index ["employment_status"], name: "index_employees_on_employment_status"
    t.index ["gender"], name: "index_employees_on_gender"
    t.index ["hire_date"], name: "index_employees_on_hire_date"
    t.index ["performance_rating"], name: "index_employees_on_performance_rating"
  end

  create_table "salary_histories", force: :cascade do |t|
    t.integer "employee_id", null: false
    t.decimal "salary"
    t.string "currency"
    t.date "effective_from"
    t.date "effective_to"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "change_reason"
    t.decimal "bonus", default: "0.0"
    t.text "notes"
    t.index ["employee_id", "effective_from"], name: "index_salary_histories_on_employee_id_and_effective_from"
    t.index ["employee_id"], name: "index_salary_histories_on_employee_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "salary_histories", "employees"
end
