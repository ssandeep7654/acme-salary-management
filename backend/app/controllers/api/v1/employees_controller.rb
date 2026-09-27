require "csv"

module Api
  module V1
    class EmployeesController < ApplicationController
      before_action :set_employee, only: [:show, :update, :destroy]

      # GET /api/v1/employees
      def index
        scope = Employee.all
        scope = scope.search_query(params[:query]) if params[:query].present?
        scope = scope.by_country(params[:country]) if params[:country].present?
        scope = scope.by_department(params[:department]) if params[:department].present?
        scope = scope.by_status(params[:employment_status]) if params[:employment_status].present?
        scope = scope.by_gender(params[:gender]) if params[:gender].present?

        # Sorting
        sort_column = %w[id employee_code first_name last_name current_salary hire_date department country].include?(params[:sort_by]) ? params[:sort_by] : "id"
        sort_order = params[:order]&.downcase == "desc" ? "desc" : "asc"
        scope = scope.order("#{sort_column} #{sort_order}")

        # Pagination
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 25).to_i
        per_page = 100 if per_page > 100

        total_count = scope.count
        total_pages = (total_count.to_f / per_page).ceil
        employees = scope.offset((page - 1) * per_page).limit(per_page)

        render json: {
          employees: employees.map { |emp| employee_json(emp) },
          pagination: {
            current_page: page,
            per_page: per_page,
            total_count: total_count,
            total_pages: total_pages
          }
        }
      end

      # GET /api/v1/employees/:id
      def show
        render json: {
          employee: employee_json(@employee),
          salary_histories: @employee.salary_histories.map { |sh| salary_history_json(sh) }
        }
      end

      # POST /api/v1/employees
      def create
        employee = Employee.new(employee_params)
        if employee.save
          SalaryHistory.create!(
            employee: employee,
            salary: employee.current_salary,
            bonus: (employee.current_salary * 0.1).round(2),
            currency: employee.currency,
            effective_from: employee.hire_date || Date.today,
            change_reason: "Initial Offer",
            notes: "Initial salary record upon creation."
          )
          render json: { employee: employee_json(employee) }, status: :created
        else
          render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT/PATCH /api/v1/employees/:id
      def update
        if @employee.update(employee_params)
          render json: { employee: employee_json(@employee) }
        else
          render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/employees/:id
      def destroy
        @employee.destroy
        head :no_content
      end

      # POST /api/v1/employees/bulk_import
      def bulk_import
        unless params[:file].present?
          return render json: { error: "No CSV file uploaded" }, status: :bad_request
        end

        file = params[:file]
        result = BulkImportService.process_csv(file.path)
        render json: result
      end

      # GET /api/v1/employees/export
      def export
        scope = Employee.all
        scope = scope.search_query(params[:query]) if params[:query].present?
        scope = scope.by_country(params[:country]) if params[:country].present?
        scope = scope.by_department(params[:department]) if params[:department].present?
        scope = scope.by_status(params[:employment_status]) if params[:employment_status].present?

        csv_data = CSV.generate(headers: true) do |csv|
          csv << ["employee_code", "first_name", "last_name", "email", "country", "department", "job_title", "employment_status", "current_salary", "currency", "current_salary_usd", "gender", "hire_date", "performance_rating"]
          scope.find_each do |emp|
            csv << [
              emp.employee_code,
              emp.first_name,
              emp.last_name,
              emp.email,
              emp.country,
              emp.department,
              emp.job_title,
              emp.employment_status,
              emp.current_salary,
              emp.currency,
              emp.current_salary_usd,
              emp.gender,
              emp.hire_date,
              emp.performance_rating
            ]
          end
        end

        send_data csv_data, filename: "acme_employees_export_#{Date.today}.csv", type: "text/csv"
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Employee not found" }, status: :not_found
      end

      def employee_params
        params.require(:employee).permit(
          :employee_code, :first_name, :last_name, :email, :country,
          :department, :job_title, :employment_status, :current_salary,
          :currency, :gender, :hire_date, :performance_rating
        )
      end

      def employee_json(employee)
        {
          id: employee.id,
          employee_code: employee.employee_code,
          first_name: employee.first_name,
          last_name: employee.last_name,
          full_name: employee.full_name,
          email: employee.email,
          country: employee.country,
          department: employee.department,
          job_title: employee.job_title,
          employment_status: employee.employment_status,
          current_salary: employee.current_salary.to_f,
          currency: employee.currency,
          current_salary_usd: employee.current_salary_usd.to_f,
          gender: employee.gender,
          hire_date: employee.hire_date,
          performance_rating: employee.performance_rating
        }
      end

      def salary_history_json(sh)
        {
          id: sh.id,
          salary: sh.salary.to_f,
          bonus: sh.bonus.to_f,
          currency: sh.currency,
          effective_from: sh.effective_from,
          effective_to: sh.effective_to,
          change_reason: sh.change_reason,
          notes: sh.notes
        }
      end
    end
  end
end
