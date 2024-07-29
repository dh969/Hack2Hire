from email.mime.text import MIMEText
import smtplib
from flask import current_app
from flask_mail import Message
from ..Models.models import db, Watchlist,User
from datetime import datetime, timedelta
import requests
import pika

# RabbitMQ connection setup
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='flight_notifications')

def send_to_rabbitmq(subject, body,email):
    message = f"Subject: {subject}\nBody: {body}\nEmail: {email}"
    print(message)
    channel.basic_publish(exchange='',
                          routing_key='flight_notifications',
                          body=message)
    print(f" [x] Sent notification to RabbitMQ")

def check_flight_status():
    
    #send_to_rabbitmq('hi','dhruv','dhruvchawla969@gmail.com')
    print('Triggered flight status check')
    watchlists = Watchlist.query.all()
    print(f"Found {len(watchlists)} watchlists to check")

    for watchlist in watchlists:
        user_id = watchlist.user_id
        user = User.query.filter_by(id=user_id).first()

        if user:
            user_email = user.email
            print(f"User ID: {user_id}, Email: {user_email}")
        api_key = current_app.config['AVIATION_API_KEY']
        url = f"http://api.aviationstack.com/v1/flights?access_key={api_key}&dep_iata={watchlist.dep_iata}&arr_iata={watchlist.arr_iata}&airline_name={watchlist.airline_name}"
        response = requests.get(url)
        flights_data = response.json().get('data', [])

        if not flights_data:
            print(f"No flight data found for {watchlist.flight_iata}")
            continue

        target_datetime = watchlist.departure_time
        target_date = target_datetime.date()

        relevant_flights = [
            flight for flight in flights_data 
            if datetime.fromisoformat(flight['departure']['scheduled']).date() == target_date
        ]

        if relevant_flights:
            flight_data = relevant_flights[0]
            changes = []

            
            new_status = flight_data.get('flight_status')
            print("status",new_status,watchlist.current_status)
            if new_status and new_status != watchlist.current_status:
                changes.append(f"Status changed from {watchlist.current_status} to {new_status}")
                watchlist.current_status = new_status

            
            new_departure_time_str = flight_data['departure'].get('estimated')
            print("time",new_departure_time_str,watchlist.departure_time)
            if new_departure_time_str:
                new_departure_time = datetime.fromisoformat(new_departure_time_str).replace(tzinfo=None)
                print("newdep",new_departure_time)
                if abs((new_departure_time - target_datetime).total_seconds()) > 600:  # 10 minutes threshold
                    print('here')
                    changes.append(f"Departure time changed to {new_departure_time.strftime('%Y-%m-%d %H:%M:%S')}")
                    watchlist.departure_time = new_departure_time

            
            new_arrival_time_str = flight_data['arrival'].get('estimated')
            if new_arrival_time_str:
                new_arrival_time = datetime.fromisoformat(new_arrival_time_str).replace(tzinfo=None)
                scheduled_arrival_time = watchlist.arrival_time.replace(tzinfo=None)
                if abs((new_arrival_time - scheduled_arrival_time).total_seconds()) > 600:  # 10 minutes threshold
                    changes.append(f"Arrival time changed to {new_arrival_time.strftime('%Y-%m-%d %H:%M:%S')}")
                    watchlist.arrival_time = new_arrival_time

            
            new_departure_gate = flight_data['departure'].get('gate')
            if new_departure_gate and new_departure_gate != watchlist.departure_gate:
                changes.append(f"Departure gate changed to {new_departure_gate}")
                watchlist.departure_gate = new_departure_gate

            
            new_arrival_gate = flight_data['arrival'].get('gate')
            print("gate ",watchlist.arrival_gate,new_arrival_gate)
            if new_arrival_gate and new_arrival_gate != watchlist.arrival_gate:
                changes.append(f"Arrival gate changed to {new_arrival_gate}")
                watchlist.arrival_gate = new_arrival_gate

            if changes:
                watchlist.last_notified = datetime.utcnow()
                
                
                subject = f"Flight {watchlist.flight_iata} Update"
                body = "\n".join(changes)
                
                
                send_to_rabbitmq(subject, body,user_email)
        
        watchlist.last_checked = datetime.utcnow()
        db.session.commit()

def close_rabbitmq_connection():
    connection.close()