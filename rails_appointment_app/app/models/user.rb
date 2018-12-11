class User < ApplicationRecord
  has_many   :appointments
  has_many   :rooms, through: :appointments
  has_secure_password
  # validates :name, presence: true
  # validates :email, presence: true, uniqueness: true
end
