class Appointment < ApplicationRecord
  belongs_to :user
  belongs_to :room

  def start_time_friendly
    start_time.strftime("%A %B %e %Y %l:%M %p")
  end

  def end_time_friendly
    end_time.strftime("%A %B %e %Y %l:%M %p")
  end

end
