#!/bin/bash

# Package Resolution Mode Switcher
# Switch between local (source) and production (node_modules) modes

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Get current mode
get_current_mode() {
    if [ -f .env.local ]; then
        if grep -q "RESOLVE_FROM_SOURCE=true" .env.local; then
            echo "local"
        else
            echo "production"
        fi
    elif [ -f .env ]; then
        if grep -q "RESOLVE_FROM_SOURCE=true" .env; then
            echo "local"
        else
            echo "production"
        fi
    else
        echo "unknown"
    fi
}

# Switch to local development mode
switch_to_local() {
    print_header "Switching to LOCAL mode (source packages)"
    
    print_info "Copying .env.docker to .env.local"
    cp .env.docker .env.local
    
    print_info "Setting package resolution to SOURCE"
    sed -i.bak 's/RESOLVE_FROM_SOURCE=false/RESOLVE_FROM_SOURCE=true/' .env.local
    sed -i.bak 's/PACKAGE_MODE=production/PACKAGE_MODE=local/' .env.local
    rm -f .env.local.bak
    
    print_info "Stopping current containers"
    docker-compose down
    
    print_info "Starting services with LOCAL mode"
    docker-compose -f docker-compose.yml up -d
    
    print_success "Switched to LOCAL mode"
    echo ""
    echo "Configuration:"
    echo "  MODE: local"
    echo "  Packages: Source (/packages/*/src)"
    echo "  Hot Reload: Enabled"
    echo "  Env File: .env.local"
}

# Switch to production mode
switch_to_production() {
    print_header "Switching to PRODUCTION mode (pre-built packages)"
    
    print_info "Building packages first"
    yarn build:package
    
    print_info "Copying .env.production to .env"
    cp .env.production .env
    
    print_info "Setting package resolution to NODE_MODULES"
    sed -i.bak 's/RESOLVE_FROM_SOURCE=true/RESOLVE_FROM_SOURCE=false/' .env
    sed -i.bak 's/PACKAGE_MODE=local/PACKAGE_MODE=production/' .env
    rm -f .env.bak
    
    print_info "Stopping current containers"
    docker-compose down
    
    print_info "Starting services with PRODUCTION mode"
    docker-compose -f docker-compose.production.yml up -d
    
    print_success "Switched to PRODUCTION mode"
    echo ""
    echo "Configuration:"
    echo "  MODE: production"
    echo "  Packages: node_modules (pre-built)"
    echo "  Hot Reload: Disabled"
    echo "  Env File: .env"
}

# Show current mode
show_status() {
    print_header "Package Resolution Status"
    
    local mode=$(get_current_mode)
    
    if [ "$mode" = "local" ]; then
        echo -e "${GREEN}Current Mode: LOCAL DEVELOPMENT${NC}"
        echo "  Source: /packages/*/src"
        echo "  Hot Reload: Enabled"
        echo "  Env File: .env.local or .env.docker"
        echo ""
        echo "Features:"
        echo "  ✓ Import from source packages"
        echo "  ✓ Changes auto-reload"
        echo "  ✓ Direct debugging"
        echo "  ✓ No build step needed"
    elif [ "$mode" = "production" ]; then
        echo -e "${YELLOW}Current Mode: PRODUCTION${NC}"
        echo "  Source: node_modules (pre-built)"
        echo "  Hot Reload: Disabled"
        echo "  Env File: .env or .env.production"
        echo ""
        echo "Features:"
        echo "  ✓ Optimized bundle size"
        echo "  ✓ Faster startup"
        echo "  ✓ Pre-compiled code"
        echo "  ✓ Production-ready"
    else
        echo -e "${RED}Unknown Mode${NC}"
        echo "No valid environment file found"
    fi
    
    print_info "Running containers:"
    docker-compose ps --no-trunc 2>/dev/null | tail -4
}

# Show environment variables
show_env() {
    print_header "Current Environment Configuration"
    
    if [ -f .env.local ]; then
        echo "From .env.local:"
        grep -E "NODE_ENV|PACKAGE_MODE|RESOLVE_FROM_SOURCE|NODE_PATH" .env.local || true
    elif [ -f .env ]; then
        echo "From .env:"
        grep -E "NODE_ENV|PACKAGE_MODE|RESOLVE_FROM_SOURCE|NODE_PATH" .env || true
    fi
    
    echo ""
    echo "Database Configuration:"
    grep -E "MONGODB_URL|REDIS_URL" .env* 2>/dev/null | head -4
}

# Help message
show_help() {
    echo "Package Resolution Mode Switcher"
    echo ""
    echo "Usage: ./switch-package-mode.sh [command]"
    echo ""
    echo "Commands:"
    echo "  local              Switch to LOCAL mode (source packages)"
    echo "  production         Switch to PRODUCTION mode (pre-built packages)"
    echo "  status             Show current mode status"
    echo "  env                Show current environment variables"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./switch-package-mode.sh local"
    echo "  ./switch-package-mode.sh production"
    echo "  ./switch-package-mode.sh status"
    echo ""
    echo "What's the difference?"
    echo ""
    echo "LOCAL MODE (source packages):"
    echo "  - Imports from /packages/*/src"
    echo "  - Hot-reload enabled"
    echo "  - Great for development"
    echo "  - Changes reflected immediately"
    echo ""
    echo "PRODUCTION MODE (pre-built packages):"
    echo "  - Imports from node_modules"
    echo "  - Optimized bundles"
    echo "  - Fast startup"
    echo "  - Ready for deployment"
    echo ""
}

# Main switch
case "$1" in
    "local")
        switch_to_local
        ;;
    "production")
        switch_to_production
        ;;
    "status")
        show_status
        ;;
    "env")
        show_env
        ;;
    "help"|"-h"|"--help"|"")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo "Run './switch-package-mode.sh help' for available commands"
        exit 1
        ;;
esac
