class User < ApplicationRecord
  has_many   :appointments
  has_many   :rooms, through: :appointments
end
