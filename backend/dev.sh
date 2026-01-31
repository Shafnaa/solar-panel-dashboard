PORT="${PORT:-8080}"
uvicorn solar_panel.main:app --port $PORT --host 0.0.0.0 --forwarded-allow-ips '*' --reload