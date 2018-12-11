class Api::EventsController < ApplicationController

  def index
    @events = Even.all
    search_term = params[:search]
    if search_term 
      @events = @evens.where(
                            "name iLIKE ? OR description iLIKE ? OR place iLIKE ?", 
                            "%#{search_term}%", 
                            "%#{search_term}%", 
                            "%#{search_term}%"
                            )
  end
    sort_attribute = params[:sort]
    sort_order = params[:sort_order]
  if sort_attribute && sort_order
    @events = @events.order(sort_attribute => sort_order)
  elsif sort_attribute
    @events = @events.order(sort_attribute)
  end
    # What are we rendering? I am asking because we are pulling from 3rd party API? render 'index.json.jbuilder'
  end

  def create
    @event = Event.new(
                      name: params[:name],
                      description: params[:description],
                      website: params[:website],
                      place: place[:place],
                      start_time: start_time[:start_time],
                      end_time: end_time[:end_time]
                      )
  end

  def show
    @events.all
  end

  def update
    @event = Event.all(params[:start_time])

    @event.name = params[:name] || @event.name
    @event.description = params[:description] || @event.description
    @event.website = params[:website] || @event.website
    @event.place = params[:place] || @event.place
    @event.start_time = params[:start_time] || @event.start_time
    @event.end_time = params[:end_time] || @event.end_time

    @event.save
    # render "show.json.jbuilder"
  end

  def destroy
    @event = Event.find(params[:start_time])
    @event.destroy
    render json: {message: "successfully removed"}
  end
end
