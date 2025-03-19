from flask import Blueprint, request, jsonify
from models import db, User
from utils.security import hash_password, check_password
from utils.validators import UserSchema
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from flask_bcrypt import Bcrypt  # ✅ Import bcrypt
import datetime
from utils.logger import logger

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()  # ✅ Initialize bcrypt
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
        username=data['username'],
        email=data['email'],
        password=hash_password(data['password'])  # ✅ Ensure password is hashed
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])  # ✅ Added missing route
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password(user.password, password):  # ✅ Used check_password function
        logger.warning(f"Failed login attempt for email: {email}")
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=str(user.id))  # ✅ Fixed missing import
    refresh_token = create_refresh_token(identity=str(user.id))
    
    logger.info(f"User {user.id} logged in successfully")
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)  # ✅ Fixed incorrect decorator
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200
