class AppointmentsController < ApplicationController
  before_action :set_appointment, only: [:show, :edit, :update, :destroy]

  # GET /appointments
  # GET /appointments.json
  def index
    @appointments = Appointment.all
  end

  # GET /appointments/1
  # GET /appointments/1.json
  def show
  end

  # GET /appointments/new
  def new
    @appointment = Appointment.new
  end

  # GET /appointments/1/edit
  def edit
  end

  # POST /appointments
  # POST /appointments.json
  def create
    @appointment = Appointment.new(appointment_params)

    respond_to do |format|
      if check_schedule && @appointment.save
        appointment_cable(@appointment)
        format.html { redirect_to @appointment, notice: 'Appointment was successfully created.' }
        format.json { render :show, status: :created, location: @appointment }
      else
        format.html { render :new }
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /appointments/1
  # PATCH/PUT /appointments/1.json
  def update
    respond_to do |format|
      if @appointment.update(appointment_params)
        format.html { redirect_to @appointment, notice: 'Appointment was successfully updated.' }
        format.json { render :show, status: :ok, location: @appointment }
      else
        format.html { render :edit }
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /appointments/1
  # DELETE /appointments/1.json
  def destroy
    @appointment.destroy
    respond_to do |format|
      format.html { redirect_to appointments_url, notice: 'Appointment was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_appointment
      @appointment = Appointment.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def appointment_params
      params.require(:appointment).permit(:name, :description, :kind, :start_time, :end_time, :room_id, :user_id)
    end

    def user_appointments
      User.find(appointment_params[:user_id]).appointments
    end

    def room_appointments
      Room.find(appointment_params[:room_id]).appointments
    end

    def intersection_times (new_start, new_end, old_start, old_end )
      return true if (old_start == nil || old_end == nil)
      (new_start <= old_start && new_end <= old_start) || 
      (new_start >= old_end && new_end >= old_end)
    end

    def check_schedule
      check_user_appointments = user_appointments.all? { |appointment| 
        intersection_times(
          @appointment.start_time, 
          @appointment.end_time, 
          appointment.start_time, 
          appointment.end_time
      )}

      check_room_appointments = room_appointments.all? { |appointment| 
        intersection_times(
          @appointment.start_time, 
          @appointment.end_time, 
          appointment.start_time, 
          appointment.end_time
      )}
      puts "check_user_appointments #{check_user_appointments} && check_room_appointments #{check_room_appointments}"

      check_user_appointments && check_room_appointments
    end

    def appointment_cable(appointment)
      ActionCable.server.broadcast(
        "appointment_channel",
        appointment
      )
    end

end
