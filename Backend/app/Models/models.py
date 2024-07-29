from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    watchlists = db.relationship('Watchlist', backref='user', lazy=True)

class Watchlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    flight_iata = db.Column(db.String(10), nullable=False)
    current_status = db.Column(db.String(20), nullable=False)
    arrival_time = db.Column(db.DateTime, nullable=True)
    arrival_airport = db.Column(db.String(100), nullable=True)
    arr_iata = db.Column(db.String(100), nullable=True)
    dep_iata = db.Column(db.String(100), nullable=True)
    departure_time = db.Column(db.DateTime, nullable=True)
    departure_airport = db.Column(db.String(100), nullable=True)
    airline_name = db.Column(db.String(100), nullable=True)
    last_checked = db.Column(db.DateTime, default=datetime.utcnow)
    last_notified = db.Column(db.DateTime, nullable=True)
    departure_gate = db.Column(db.String(10), nullable=True)
    arrival_gate = db.Column(db.String(10), nullable=True)
    last_checked = db.Column(db.DateTime, default=datetime.utcnow)