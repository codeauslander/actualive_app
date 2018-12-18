json.extract! appointment, :id, :name, :description, :kind, :start_time, :start_time_friendly, :end_time, :end_time_friendly, :room_id, :user_id, :created_at, :updated_at
json.url appointment_url(appointment, format: :json)
