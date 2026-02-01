# Makefile for managing microservices

.PHONY: all start stop restart clean clean-build clean-logs status help

# Default target
all: start

# Start all services
start:
	@chmod +x scripts/start_all.sh
	@./scripts/start_all.sh

# Stop all services
stop:
	@chmod +x scripts/stop_all.sh
	@./scripts/stop_all.sh

# Restart all services
restart: stop
	@sleep 2
	@$(MAKE) start

# Clean everything (build + logs)
clean:
	@echo "🧹 Cleaning build artifacts and logs..."
	@rm -rf servers/backend/springboot_pgsql/build
	@rm -rf logs
	@rm -rf .pids
	@echo "✅ Clean complete"

# Clean only build artifacts
clean-build:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf servers/backend/springboot_pgsql/build
	@echo "✅ Build artifacts removed"

# Clean only logs
clean-logs:
	@echo "🧹 Cleaning logs..."
	@rm -rf logs
	@rm -rf .pids
	@echo "✅ Logs removed"

# Check status of services
status:
	@echo "📊 Service Status:"
	@echo ""
	@echo "Express UI (Port 3000):"
	@lsof -i :3000 2>/dev/null || echo "   ❌ Not running"
	@echo ""
	@echo "Express Gateway (Port 3001):"
	@lsof -i :3001 2>/dev/null || echo "   ❌ Not running"
	@echo ""
	@echo "Express Mongo (Port 3002):"
	@lsof -i :3002 2>/dev/null || echo "   ❌ Not running"
	@echo ""
	@echo "Spring Boot (Port 8080):"
	@lsof -i :8080 2>/dev/null || echo "   ❌ Not running"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	@cd servers/frontend/express_ui && npm install
	@cd servers/backend/express_gateway && npm install
	@cd servers/backend/express_mongo && npm install
	@echo "✅ Dependencies installed"

# Show help
help:
	@echo "Available targets:"
	@echo "  make start       - Start all services"
	@echo "  make stop        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make status      - Check service status"
	@echo "  make install     - Install npm dependencies"
	@echo "  make clean       - Remove build artifacts and logs"
	@echo "  make clean-build - Remove only build artifacts"
	@echo "  make clean-logs  - Remove only logs"
	@echo "  make help        - Show this help message"
