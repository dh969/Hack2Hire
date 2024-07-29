from flask import Flask, request, jsonify, Blueprint,current_app
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from app.Models.models import User, db
import app.config 

account_bp = Blueprint('account', __name__)

@account_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'})

@account_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401

    
    token = jwt.encode(
        {
            'sub': user.id,  
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  
        },
        current_app.config['SECRET_KEY'],  # Replace with a secure key
        algorithm='HS256'
    )

    return jsonify({'token': token}), 200
