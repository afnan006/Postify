import logging
import os

# Ensure 'logs' directory exists
log_dir = "backend/logs"
os.makedirs(log_dir, exist_ok=True)  # ✅ Create 'logs' folder if missing

logging.basicConfig(
    filename=os.path.join(log_dir, "app.log"),  # ✅ Use dynamic path
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)
