param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('all', 'build', 'start', 'test', 'stop', 'logs')]
    [string]$Command
)

$ErrorActionPreference = "Stop"

function Write-Info {
    param([string]$Message)
    Write-Host "INFO: $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "SUCCESS: $Message" -ForegroundColor Green
}

function Write-Error-Message {
    param([string]$Message)
    Write-Host "ERROR: $Message" -ForegroundColor Red
}

switch ($Command) {
    'all' {
        Write-Info "Running all steps: build, start, test"
        & $PSScriptRoot\run.ps1 build
        & $PSScriptRoot\run.ps1 start
        & $PSScriptRoot\run.ps1 test
        Write-Success "All steps completed"
    }
    
    'build' {
        Write-Info "Building monolith..."
        
        # Install dependencies
        Write-Info "Installing dependencies..."
        Set-Location "$PSScriptRoot\monolith"
        npm install
        Set-Location $PSScriptRoot
        
        # Build TypeScript
        Write-Info "Compiling TypeScript..."
        Set-Location "$PSScriptRoot\monolith"
        npm run build
        Set-Location $PSScriptRoot
        
        # Build Docker images
        Write-Info "Building Docker images..."
        docker-compose -f docker-compose.yml build
        
        Write-Success "Build completed"
    }
    
    'start' {
        Write-Info "Starting infrastructure services..."
        docker-compose -f docker-compose.local.yml up -d
        
        Write-Info "Waiting for services to be ready..."
        Start-Sleep -Seconds 5
        
        Write-Info "Starting monolith application..."
        Set-Location "$PSScriptRoot\monolith"
        Start-Process pwsh -ArgumentList "-Command", "npm run dev" -NoNewWindow
        Set-Location $PSScriptRoot
        
        Write-Success "Services started"
        Write-Info "Monolith: http://localhost:8080"
        Write-Info "ERP API: http://localhost:3000"
        Write-Info "Tax API: http://localhost:3001"
        Write-Info "PostgreSQL: localhost:5432"
    }
    
    'test' {
        Write-Info "Running tests..."
        Set-Location "$PSScriptRoot\system-test"
        npm install
        npm test
        Set-Location $PSScriptRoot
        Write-Success "Tests completed"
    }
    
    'stop' {
        Write-Info "Stopping all services..."
        docker-compose -f docker-compose.yml down
        docker-compose -f docker-compose.local.yml down
        
        # Stop any Node.js processes
        Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
        
        Write-Success "Services stopped"
    }
    
    'logs' {
        Write-Info "Showing Docker logs..."
        docker-compose -f docker-compose.yml logs -f
    }
}
