require "csv"

class BulkImportService
  def self.process_csv(file_path)
    success_count = 0
    errors = []

    rows = CSV.read(file_path, headers: true)
    
    rows.each_with_index do |row, idx|
      line_num = idx + 2
      emp_code = row["employee_code"] || sprintf("EMP-IMPORT-%05d", line_num)
      email = row["email"] || "import.#{line_num}@acme-corp.com"

      employee = Employee.find_or_initialize_by(employee_code: emp_code)
      employee.attributes = {
        first_name: row["first_name"] || "Employee",
        last_name: row["last_name"] || "Imported",
        email: email,
        country: row["country"] || "United States",
        department: row["department"] || "Engineering",
        job_title: row["job_title"] || "Software Engineer",
        employment_status: row["employment_status"] || "active",
        current_salary: row["current_salary"] ? row["current_salary"].to_f : 75000.0,
        currency: row["currency"] || "USD",
        gender: row["gender"] || "Female",
        hire_date: row["hire_date"] ? Date.parse(row["hire_date"]) : Date.today,
        performance_rating: row["performance_rating"] ? row["performance_rating"].to_i : 3
      }

      if employee.save
        success_count += 1
        SalaryHistory.create(
          employee: employee,
          salary: employee.current_salary,
          bonus: (employee.current_salary * 0.1).round(2),
          currency: employee.currency,
          effective_from: employee.hire_date || Date.today,
          change_reason: "Bulk CSV Import",
          notes: "Created during CSV bulk import process."
        )
      else
        errors << "Line #{line_num}: #{employee.errors.full_messages.join(', ')}"
      end
    end

    { success_count: success_count, total_rows: rows.size, errors: errors }
  end
end
