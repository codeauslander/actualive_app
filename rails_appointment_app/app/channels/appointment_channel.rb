class AppointmentChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    p 'subscribed'
    stream_from "appointment_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    p 'speak'
  end
end
