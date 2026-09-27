module Api
  module V1
    class AnalyticsController < ApplicationController
      def overview
        render json: SalaryAnalyticsService.overview
      end

      def by_country
        render json: SalaryAnalyticsService.by_country
      end

      def by_department
        render json: SalaryAnalyticsService.by_department
      end

      def gender_pay_equity
        render json: SalaryAnalyticsService.gender_pay_equity
      end

      def performance_vs_salary
        render json: SalaryAnalyticsService.performance_vs_salary
      end

      def insights
        render json: SalaryAnalyticsService.insights
      end
    end
  end
end
