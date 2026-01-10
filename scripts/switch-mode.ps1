# Package Resolution Mode Switcher (PowerShell Version)
# Switch between local (source) and production (node_modules) modes

param(
    [Parameter(Position=0)]
    [ValidateSet("local", "production", "status", "env", "help")]
    [string]$Command = "help"
)

# Helper functions
function Write-Header {
    param([string]$text)
    Write-Host "================================================" -ForegroundColor Blue
    Write-Host $text -ForegroundColor Blue
    Write-Host "================================================" -ForegroundColor Blue
}

function Write-Success {
    param([string]$text)
    Write-Host "[OK] $text" -ForegroundColor Green
}

function Write-Info {
    param([string]$text)
    Write-Host "[INFO] $text" -ForegroundColor Cyan
}

function Write-Warn {
    param([string]$text)
    Write-Host "[WARN] $text" -ForegroundColor Yellow
}

# Get current mode
function Get-CurrentMode {
    if (Test-Path ".env") {
        $content = Get-Content ".env" -Raw
        if ($content -match "RESOLVE_FROM_SOURCE=true") {
            return "local"
        } else {
            return "production"
        }
    }
    return "unknown"
}

# Switch to local development mode
function Switch-ToLocal {
    Write-Header -text "Switching to LOCAL mode (source packages)"
    
    # Copy root .env.local to .env
    if (Test-Path ".env.local") {
        Write-Info -text "Copying root .env.local to .env"
        Copy-Item ".env.local" ".env" -Force
    }
    
    # Check .env.local for each app
    $apps = @("admin-app", "seller-app", "shell-app", "storefront-app")
    foreach ($app in $apps) {
        $envLocal = "apps/$app/.env.local"
        if (Test-Path $envLocal) {
            Write-Success -text "Found $envLocal"
        } else {
            Write-Warn -text "Missing $envLocal"
        }
    }
    
    # Check .env.local for each service
    $services = @("auth-service", "category-service", "coupon-service", "product-service", "order-service", "graphql-gateway")
    foreach ($service in $services) {
        $envLocal = "services/$service/.env.local"
        if (Test-Path $envLocal) {
            Write-Success -text "Found $envLocal"
        } else {
            Write-Warn -text "Missing $envLocal"
        }
    }
    
    Write-Info -text "Setting package resolution to SOURCE"
    if (Test-Path ".env") {
        $content = Get-Content ".env" -Raw
        $content = $content -replace "RESOLVE_FROM_SOURCE=false", "RESOLVE_FROM_SOURCE=true"
        $content = $content -replace "PACKAGE_MODE=production", "PACKAGE_MODE=local"
        $content = $content -replace "NODE_ENV=production", "NODE_ENV=development"
        Set-Content ".env" $content
    }
    
    Write-Success -text "Switched to LOCAL mode"
}

# Switch to production mode
function Switch-ToProduction {
    Write-Header -text "Switching to PRODUCTION mode (pre-built packages)"
    
    Write-Info -text "Building packages first"
    yarn build:package
    
    # Copy root .env.production to .env
    if (Test-Path ".env.production") {
        Write-Info -text "Copying root .env.production to .env"
        Copy-Item ".env.production" ".env" -Force
    }
    
    # Copy .env.production for each app
    $apps = @("admin-app", "seller-app", "shell-app", "storefront-app")
    foreach ($app in $apps) {
        $envProd = "apps/$app/.env.production"
        $envLocal = "apps/$app/.env.local"
        if (Test-Path $envProd) {
            Write-Info -text "Copying $envProd to $envLocal"
            Copy-Item $envProd $envLocal -Force
            Write-Success -text "Copied $envProd"
        } else {
            Write-Warn -text "Missing $envProd"
        }
    }
    
    # Copy .env.production for each service
    $services = @("auth-service", "category-service", "coupon-service", "product-service", "order-service", "graphql-gateway")
    foreach ($service in $services) {
        $envProd = "services/$service/.env.production"
        $envLocal = "services/$service/.env.local"
        if (Test-Path $envProd) {
            Write-Info -text "Copying $envProd to $envLocal"
            Copy-Item $envProd $envLocal -Force
            Write-Success -text "Copied $envProd"
        } else {
            Write-Warn -text "Missing $envProd"
        }
    }
    
    Write-Info -text "Setting package resolution to NODE_MODULES"
    if (Test-Path ".env") {
        $content = Get-Content ".env" -Raw
        $content = $content -replace "RESOLVE_FROM_SOURCE=true", "RESOLVE_FROM_SOURCE=false"
        $content = $content -replace "PACKAGE_MODE=local", "PACKAGE_MODE=production"
        Set-Content ".env" $content
    }
    
    Write-Success -text "Switched to PRODUCTION mode"
}

# Show current mode
function Show-Status {
    Write-Header -text "Package Resolution Status"
    
    $mode = Get-CurrentMode
    
    if ($mode -eq "local") {
        Write-Host "Current Mode: LOCAL DEVELOPMENT" -ForegroundColor Green
    } elseif ($mode -eq "production") {
        Write-Host "Current Mode: PRODUCTION" -ForegroundColor Yellow
    } else {
        Write-Host "Unknown Mode" -ForegroundColor Red
        Write-Host "No valid environment file found"
    }
}

# Show help
function Show-Help {
    Write-Host "Package Resolution Mode Switcher"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  help               Show this help message"
    Write-Host "  status             Show current mode status"
    Write-Host "  local              Switch to LOCAL mode (source packages)"
    Write-Host "  production         Switch to PRODUCTION mode (pre-built packages)"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\switch-mode.ps1 local"
}

# Main switch
switch ($Command) {
    "help" { Show-Help }
    "local" { Switch-ToLocal }
    "status" { Show-Status }
    "production" { Switch-ToProduction }
    default { Show-Help }
}
