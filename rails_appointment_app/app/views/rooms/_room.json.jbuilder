json.extract! room, :id, :name, :description, :availability, :created_at, :updated_at
json.url room_url(room, format: :json)
