import os
import smtplib

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:1234@localhost:5433/flights_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY="SuperSecretKey1234"
    SCHEDULER_API_ENABLED = True
    AVIATION_API_KEY='6ef09431c256517f8e803fdd9146e8b6'
