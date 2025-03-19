from flask import Flask
from models import db
from config import Config
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.post_routes import post_bp
from sqlalchemy import text
from utils.logger import logger
import logging
from flask_migrate import Migrate

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS properly
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

# Enable SQLAlchemy query logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

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
            connection.execute(text("SELECT 1"))
        return "Database is connected!"
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        return f"Database connection error: {str(e)}", 500

if __name__ == "__main__":
    app.run(debug=True)
