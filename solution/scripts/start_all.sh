#!/bin/bash

# --- Configuration ---
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"
PID_DIR="$SCRIPT_DIR/.pids"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Port Definitions
PORT_UI=3000
PORT_GATEWAY=3001
PORT_MONGO=3002
PORT_PGSQL=8080
ALL_PORTS=($PORT_UI $PORT_GATEWAY $PORT_MONGO $PORT_PGSQL)

check_port() {
  lsof -i :$1 >/dev/null 2>&1
}

start_service() {
  local name=$1
  local dir=$2
  local log_prefix=$3
  local start_cmd=$4
  
  echo "Starting $name..."
  cd "$SCRIPT_DIR/$dir"
  
  LOG_FILE="$LOG_DIR/${log_prefix}_${TIMESTAMP}.log"
  LATEST_LOG="$LOG_DIR/${log_prefix}_latest.log"
  
  eval "$start_cmd" > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_DIR/${log_prefix}.pid"
  ln -sf "$LOG_FILE" "$LATEST_LOG"
}

# ---------------------------------------------------------------------------

echo "🚀 Starting All Services..."
echo ""

mkdir -p "$LOG_DIR" "$PID_DIR"

PORTS_IN_USE=false

for port in "${ALL_PORTS[@]}"; do
  if check_port $port; then
    echo "⚠️  Port $port is already in use"
    PORTS_IN_USE=true
  fi
done

if [ "$PORTS_IN_USE" = true ]; then
  echo ""
  read -p "Stop existing services first? (Y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    "$SCRIPT_DIR/scripts/stop_all.sh"
    sleep 2
  else
    exit 1
  fi
fi

# Dependencies check
[ ! -d "$SCRIPT_DIR/servers/frontend/express_ui/node_modules" ] && \
  (cd "$SCRIPT_DIR/servers/frontend/express_ui" && npm install)
[ ! -d "$SCRIPT_DIR/servers/backend/express_gateway/node_modules" ] && \
  (cd "$SCRIPT_DIR/servers/backend/express_gateway" && npm install)
[ ! -d "$SCRIPT_DIR/servers/backend/express_mongo/node_modules" ] && \
  (cd "$SCRIPT_DIR/servers/backend/express_mongo" && npm install)

start_service "Express UI" "servers/frontend/express_ui" "ui" "npm start"
echo "   ✓ URL: http://localhost:$PORT_UI"
echo "   ✓ URL: http://localhost:$PORT_UI/api-docs" && sleep 2

start_service "Express Gateway" "servers/backend/express_gateway" "gateway" "npm start"
echo "   ✓ URL: http://localhost:$PORT_GATEWAY/api-docs" && sleep 2

start_service "Express Mongo" "servers/backend/express_mongo" "mongo" "npm start"
echo "   ✓ URL: http://localhost:$PORT_MONGO/api-docs" && sleep 2

start_service "Spring Boot" "servers/backend/springboot_pgsql" "pgsql" "./gradlew bootRun"
echo "   ✓ URL: http://localhost:$PORT_PGSQL/api-docs" && sleep 4

echo ""
echo "✅ All services running!"
echo "📂 Logs: $LOG_DIR"
