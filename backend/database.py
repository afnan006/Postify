from flask import Flask
from models import db
from config import Config
from utils.logger import logger
from flask_sqlalchemy import event

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()
    print("Database initialized successfully!")
@event.listens_for(db.engine, "before_cursor_execute")
def before_query_execute(conn, cursor, statement, parameters, context, executemany):
    logger.info(f"Executing Query: {statement} with params {parameters}")