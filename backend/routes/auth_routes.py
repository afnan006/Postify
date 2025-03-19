from flask import Blueprint, request, jsonify
from models import db, User
from utils.security import hash_password, check_password
from utils.validators import UserSchema
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
import uuid  # Import for generating unique IDs
from utils.logger import logger

auth_bp = Blueprint('auth', __name__)
user_schema = UserSchema()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400

    new_user = User(
        id=str(uuid.uuid4()),  # Generate a unique string ID
        username=data['username'],
        email=data['email'],
        password=hash_password(data['password'])  # Ensure password is hashed
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password(user.password, password):
        logger.warning(f"Failed login attempt for email: {email}")
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.id)  # Use user.id as a string
    refresh_token = create_refresh_token(identity=user.id)

    logger.info(f"User {user.id} logged in successfully")
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()  # This will now be a string
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200