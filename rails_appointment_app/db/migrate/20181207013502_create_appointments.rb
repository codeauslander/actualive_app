class CreateAppointments < ActiveRecord::Migration[5.1]
  def change
    create_table :appointments do |t|
      t.string :name
      t.string :description
      t.integer :type
      t.datetime :start_time
      t.datetime :end_time
      t.integer :room_id
      t.integer :user_id

      t.timestamps
    end
  end
end
