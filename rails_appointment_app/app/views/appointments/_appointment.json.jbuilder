json.extract! appointment, :id, :name, :description, :kind, :start_time, :end_time, :room_id, :user_id, :created_at, :updated_at
json.url appointment_url(appointment, format: :json)
