#import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from flask import Flask
from flask_mail import Mail
from flask_apscheduler import APScheduler
from .Models.models import db
from app.config import Config
from .Producer.FlightChecker import check_flight_status,close_rabbitmq_connection,send_to_rabbitmq
from .controllers.AccountController import account_bp
from .controllers.WishlistController import watchlist_controller
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import signal
mail = Mail()
scheduler = APScheduler()



def create_app():
    app = Flask(__name__)
    
    app.config['JWT_SECRET_KEY'] = 'SuperSecretKey1234'
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    CORS(app)
    app.config.from_object(Config)
    jwt = JWTManager(app)

    db.init_app(app)
    scheduler.init_app(app)
    mail.init_app(app)
    scheduler.start()

    @scheduler.task('interval', id='check_flights', hours=1)
    def scheduled_flight_check():
        with app.app_context():
            check_flight_status()

    # with app.app_context():
    #     # send_to_rabbitmq('hi','Status changed from scheduled to landed\nDeparture time changed to 2024-07-29 09:50:00\nArrival time changed to 2024-07-29 12:35:00','dhruvchawla969@gmail.com')
    #     check_flight_status()
    # Register the blueprint
    app.register_blueprint(account_bp, url_prefix='/account')
    app.register_blueprint(watchlist_controller, url_prefix='/api')

    return app