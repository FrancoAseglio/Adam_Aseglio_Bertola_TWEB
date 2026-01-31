#!/bin/bash

# --- Configuration ---
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_DIR="$SCRIPT_DIR/.pids"
LOG_DIR="$SCRIPT_DIR/logs"

# Port Definitions (sync with start_all.sh)
PORT_UI=3000
PORT_GATEWAY=3001
PORT_MONGO=3002
PORT_PGSQL=8080
ALL_PORTS=($PORT_UI $PORT_GATEWAY $PORT_MONGO $PORT_PGSQL)

stop_service() {
  local name=$1
  local pid_id=$2
  local pid_file="$PID_DIR/$pid_id.pid"

  if [ -f "$pid_file" ]; then
    PID=$(cat "$pid_file")
    if ps -p $PID > /dev/null 2>&1; then
      kill $PID 2>/dev/null
      sleep 1
      ps -p $PID > /dev/null 2>&1 && kill -9 $PID 2>/dev/null
      echo "   ✓ $name stopped"
    fi
    rm "$pid_file"
  fi
}
# ---------------------------------------------------------------------------
echo "🛑 Stopping All Services..."
echo ""

stop_service "Spring Boot" "pgsql"
stop_service "MongoDB Backend" "mongo"
stop_service "Express Gateway" "gateway"
stop_service "Express UI" "ui"

for port in "${ALL_PORTS[@]}"; do
  PID=$(lsof -ti:$port 2>/dev/null)
  [ ! -z "$PID" ] && kill -9 $PID 2>/dev/null
done

ps aux | grep "[g]radlew bootRun" | awk '{print $2}' | xargs kill -9 2>/dev/null

if [ -d "$PID_DIR" ]; then
  rm -rf "$PID_DIR"
  echo "   ✓ PID directory removed"
fi

echo ""
read -p "Clear log files? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -d "$LOG_DIR" ]; then
    rm -rf "$LOG_DIR"
    echo "   ✓ Logs directory removed"
  fi
fi

echo ""
echo "✅ Done"
