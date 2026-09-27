module Api
  module V1
    class SalaryAdjustmentsController < ApplicationController
      def create
        employee = Employee.find(params[:employee_id])

        ActiveRecord::Base.transaction do
          # Close previous active salary history entry
          last_history = employee.salary_histories.order(effective_from: :desc).first
          if last_history && last_history.effective_to.nil?
            last_history.update!(effective_to: (Date.parse(adjustment_params[:effective_from]) - 1.day rescue Date.today))
          end

          # Create new history entry
          new_history = employee.salary_histories.create!(
            salary: adjustment_params[:salary],
            bonus: adjustment_params[:bonus] || 0.0,
            currency: adjustment_params[:currency] || employee.currency,
            effective_from: adjustment_params[:effective_from] || Date.today,
            effective_to: nil,
            change_reason: adjustment_params[:change_reason] || "Salary Revision",
            notes: adjustment_params[:notes]
          )

          # Update employee current salary
          employee.update!(
            current_salary: adjustment_params[:salary],
            currency: adjustment_params[:currency] || employee.currency
          )

          render json: {
            employee_id: employee.id,
            current_salary: employee.current_salary.to_f,
            salary_history: {
              id: new_history.id,
              salary: new_history.salary.to_f,
              bonus: new_history.bonus.to_f,
              currency: new_history.currency,
              effective_from: new_history.effective_from,
              change_reason: new_history.change_reason,
              notes: new_history.notes
            }
          }, status: :created
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Employee not found" }, status: :not_found
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      private

      def adjustment_params
        params.require(:salary_adjustment).permit(:salary, :bonus, :currency, :effective_from, :change_reason, :notes)
      end
    end
  end
end
