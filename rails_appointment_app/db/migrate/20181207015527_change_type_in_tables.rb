class ChangeTypeInTables < ActiveRecord::Migration[5.1]

  def change
    rename_column :users, :type, :kind
    rename_column :appointments, :type, :kind
  end
end
