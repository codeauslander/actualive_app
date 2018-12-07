class CreateEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :events do |t|
      t.string :name
      t.string :description
      t.string :website
      t.string :place
      t.datetime :start_time
      t.datetime :end_time

      t.timestamps
    end
  end
end
