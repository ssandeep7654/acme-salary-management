module Api
  module V1
    class AuthController < ApplicationController
      def login
        user = User.find_by(email: params[:email])
        if user&.authenticate(params[:password])
          payload = { user_id: user.id, email: user.email, role: user.role }
          token = JWT.encode(payload, Rails.application.secret_key_base)
          render json: { token: token, user: { id: user.id, email: user.email, role: user.role } }
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def me
        auth_header = request.headers["Authorization"]
        if auth_header.present?
          token = auth_header.split(" ").last
          begin
            decoded = JWT.decode(token, Rails.application.secret_key_base).first
            user = User.find(decoded["user_id"])
            render json: { user: { id: user.id, email: user.email, role: user.role } }
          rescue JWT::DecodeError
            render json: { error: "Invalid token" }, status: :unauthorized
          end
        else
          # Default HR session for demo simplicity if no header provided
          hr_user = User.find_by(email: "hr@acme.com") || User.first
          render json: { user: { id: hr_user&.id, email: hr_user&.email || "hr@acme.com", role: hr_user&.role || "hr_manager" } }
        end
      end
    end
  end
end
