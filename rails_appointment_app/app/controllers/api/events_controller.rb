class Api::EventsController < ApplicationController

  def index_eventbrites
    require 'net/http'
    require 'openssl'
    require 'json'
    
    puts 'eventbrite_token'
    puts Rails.application.secrets.eventbrite_token


    uri = URI(
              'https://www.eventbriteapi.com/v3/events/search/?categories=102&subcategories=2999,2007,2006,2005,2004&location.address=chicago,IL&location.within=25mi&price=free' +

              # 'https://www.eventbriteapi.com/v3/events/?'+
              # # 'listed=' + 'false' + '&' +
              '&token=' + Rails.application.secrets.eventbrite_token
             )
  
    Net::HTTP.start(uri.host, uri.port,
    :use_ssl => uri.scheme == 'https', 
    :verify_mode => OpenSSL::SSL::VERIFY_NONE) do |http|
  
    request = Net::HTTP::Get.new uri.request_uri
    # request.basic_auth 'tylerh@firmfoundationsmarketing.com', 'upwork'
  
    response = http.request request # Net::HTTPResponse object
  
    data = response.body
    puts 'data'
    puts data
    @events = JSON.parse(data)['events']
    # puts @events.count
    # @events = @events.select{ |event| 
      # event['start']['timezone'] == "America/Chicago" &&
      # event['is_free'] == true &&
      # event['organization_id'] == "17655774301" ||#Thinkful Chicago   
      # event['organization_id'] == "114418684247"|| #Sowingseedsofjoy.org   
      # event['organization_id'] == "2890910705" || 
      # event['organization_id'] == "6859161367" || 
      # event['organization_id'] == "17707300477"|| #Chicagoruby
      # event['organization_id'] == "6296306773" || #Fullstack Academy
      # event['organization_id'] == "2943822513" &&
      # event_with_in_a_month(event)
    # }
    # puts @events.count
    # render json: @events
    render 'index.html.erb'
    end
  end

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

  private 
  def event_with_in_a_month(event)
    days = event['start']['local'].to_datetime - Date.today
    days < 30
  end
end
