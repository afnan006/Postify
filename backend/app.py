from flask import Flask
from models import db
from config import Config
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.post_routes import post_bp
from sqlalchemy import text  # Import text for raw SQL queries

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (update as needed)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(post_bp, url_prefix="/posts")

@app.route("/")
def home():
    return "Hello, Flask is running!"

@app.route("/check-db")
def check_db():
    try:
        with db.engine.connect() as connection:
            connection.execute(text("SELECT 1"))  # Execute raw SQL query safely
        return "Database is connected!"
    except Exception as e:
        return f"Database connection error: {str(e)}", 500  # Return proper error response

if __name__ == "__main__":
    app.run(debug=True)
