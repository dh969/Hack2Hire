from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.Models.models import db, Watchlist

watchlist_controller = Blueprint('watchlist_controller', __name__)

@watchlist_controller.route('/watchlist', methods=['POST'])
@jwt_required()
def add_to_watchlist():
    user_id = get_jwt_identity()
    data = request.get_json()

    watchlist_entry = Watchlist(
        user_id=user_id,
        flight_iata=data.get('flight_iata'),
        current_status=data.get('current_status'),
        arrival_time=data.get('arrival_time'),
        arrival_airport=data.get('arrival_airport'),
        departure_time=data.get('departure_time'),
        departure_airport=data.get('departure_airport'),
        airline_name=data.get('airline_name'),
        arr_iata=data.get('arr_iata'),
        dep_iata=data.get('dep_iata'),
        arrival_gate=data.get('arrival_gate'),
        departure_gate=data.get('departure_gate')
    )

    db.session.add(watchlist_entry)
    db.session.commit()
    return jsonify({"message": "Flight added to watchlist"}), 201
@watchlist_controller.route('/watchlist', methods=['GET'])
@jwt_required()
def get_watchlist():
    current_user_id = get_jwt_identity()
    
    watchlist_items = Watchlist.query.filter_by(user_id=current_user_id).all()

    if not watchlist_items:
        return jsonify({"message": "No watchlist items found"}), 404

    watchlist_data = [
        {
            "id": item.id,
            "flight_iata": item.flight_iata,
            "current_status": item.current_status,
            "arrival_time": item.arrival_time,
            "arrival_airport": item.arrival_airport,
            "departure_time": item.departure_time,
            "departure_airport": item.departure_airport,
            "airline_name": item.airline_name,
            "last_checked": item.last_checked,
            "last_notified": item.last_notified,
            "departure_gate":item.departure_gate,
            "arrival_gate":item.arrival_gate
        }
        for item in watchlist_items
    ]

    return jsonify(watchlist_data), 200

    
