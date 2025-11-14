param(
    [Parameter(Mandatory=$true, Position=0)]
    [ValidateSet("build", "start", "test", "stop", "logs", "all")]
    [string]$Command,

    [Parameter(Position=1)]
    [ValidateSet("local", "pipeline")]
    [string]$Mode = "local"
)

$ComposeFile = if ($Mode -eq "pipeline") { "docker-compose.pipeline.yml" } else { "docker-compose.local.yml" }

function Wait-ForServices {
    Write-Host "Checking if services are healthy..." -ForegroundColor Cyan

    $maxAttempts = 30
    $attempt = 0
    $erpApiReady = $false
    $monolithReady = $false

    Write-Host "Waiting for ERP API on port 3200..." -ForegroundColor Yellow
    while (-not $erpApiReady -and $attempt -lt $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3200" -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) {
                $erpApiReady = $true
                Write-Host "[OK] ERP API is responding!" -ForegroundColor Green
            }
        } catch {
            $attempt++
            Write-Host "  Attempt $attempt/$maxAttempts - ERP API not ready yet..." -ForegroundColor Gray
            Start-Sleep -Seconds 1
        }
    }

    if (-not $erpApiReady) {
        Write-Host "[FAIL] ERP API failed to become ready" -ForegroundColor Red
        Write-Host "  Checking ERP API logs..." -ForegroundColor Yellow
        docker compose logs erp-api --tail=20
        return $false
    }

    $attempt = 0
    Write-Host "Waiting for Monolith API on port 8082..." -ForegroundColor Yellow
    while (-not $monolithReady -and $attempt -lt $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8082" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
                $monolithReady = $true
                Write-Host "[OK] Monolith API is responding!" -ForegroundColor Green
            }
        } catch {
            $attempt++
            Write-Host "  Attempt $attempt/$maxAttempts - Monolith API not ready yet..." -ForegroundColor Gray
            Start-Sleep -Seconds 1
        }
    }

    if (-not $monolithReady) {
        Write-Host "[FAIL] Monolith API failed to become ready" -ForegroundColor Red
        Write-Host "  Checking Monolith logs..." -ForegroundColor Yellow
        docker compose logs monolith --tail=50
        return $false
    }

    Write-Host ""
    Write-Host "All services are healthy and ready for testing!" -ForegroundColor Green
    return $true
}

function Build-System {
    if ($Mode -eq "local") {
        Write-Host "Building monolith application..." -ForegroundColor Cyan
        Set-Location monolith

        npm install
        npm run build

        if ($LASTEXITCODE -ne 0) {
            Write-Host "Build failed!" -ForegroundColor Red
            Set-Location ..
            exit $LASTEXITCODE
        }

        Write-Host ""
        Write-Host "Build completed successfully!" -ForegroundColor Green
        Write-Host "Compiled files created in: " -NoNewline
        Write-Host "dist\" -ForegroundColor Yellow
        Write-Host ""
        Set-Location ..
    } else {
        Write-Host "Pipeline mode: Skipping build (using pre-built Docker image)" -ForegroundColor Cyan
    }
}

function Start-System {
    Write-Host "Cleaning up any existing containers..." -ForegroundColor Cyan

    # Stop all compose configurations
    docker compose -f docker-compose.yml down 2>$null
    docker compose -f docker-compose.local.yml down 2>$null
    docker compose -f docker-compose.pipeline.yml down 2>$null

    # Force stop any containers that might be using our ports
    Write-Host "Checking for port conflicts..." -ForegroundColor Cyan
    $containersOnPort3200 = docker ps -q --filter "publish=3200" 2>$null
    $containersOnPort8082 = docker ps -q --filter "publish=8082" 2>$null
    $containersOnPort5434 = docker ps -q --filter "publish=5434" 2>$null
    $containersOnPort3201 = docker ps -q --filter "publish=3201" 2>$null

    if ($containersOnPort3200) {
        Write-Host "  Stopping containers using port 3200..." -ForegroundColor Yellow
        docker stop $containersOnPort3200 2>$null
        docker rm $containersOnPort3200 2>$null
    }

    if ($containersOnPort3201) {
        Write-Host "  Stopping containers using port 3201..." -ForegroundColor Yellow
        docker stop $containersOnPort3201 2>$null
        docker rm $containersOnPort3201 2>$null
    }

    if ($containersOnPort5434) {
        Write-Host "  Stopping containers using port 5434..." -ForegroundColor Yellow
        docker stop $containersOnPort5434 2>$null
        docker rm $containersOnPort5434 2>$null
    }

    if ($containersOnPort8082) {
        Write-Host "  Stopping containers using port 8082..." -ForegroundColor Yellow
        docker stop $containersOnPort8082 2>$null
        docker rm $containersOnPort8082 2>$null
    }

    # Wait to ensure containers are fully stopped and ports are released
    Start-Sleep -Seconds 2

    Write-Host "Starting Docker containers (mode: $Mode)..." -ForegroundColor Cyan

    docker compose -f $ComposeFile up -d --build

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "Failed to start Docker containers!" -ForegroundColor Red
        exit $LASTEXITCODE
    }

    Write-Host ""
    Write-Host "Done! Services are starting..." -ForegroundColor Green
    Write-Host "- ERP API: " -NoNewline
    Write-Host "http://localhost:3200" -ForegroundColor Yellow
    Write-Host "- Tax API: " -NoNewline
    Write-Host "http://localhost:3201" -ForegroundColor Yellow
    Write-Host "- PostgreSQL: " -NoNewline
    Write-Host "localhost:5434" -ForegroundColor Yellow
    Write-Host "- Monolith API: " -NoNewline
    Write-Host "http://localhost:8082" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To view logs: " -NoNewline
    Write-Host ".\run.ps1 logs $Mode" -ForegroundColor Cyan
    Write-Host "To stop: " -NoNewline
    Write-Host ".\run.ps1 stop $Mode" -ForegroundColor Cyan
}

function Test-System {
    Write-Host "Running tests..." -ForegroundColor Cyan

    Set-Location system-test
    npm install
    npm test
    $testResult = $LASTEXITCODE
    Set-Location ..

    if ($testResult -ne 0) {
        Write-Host ""
        Write-Host "Tests failed!" -ForegroundColor Red
        exit $testResult
    }

    Write-Host ""
    Write-Host "All tests passed!" -ForegroundColor Green
    Write-Host "Test report: " -NoNewline
    Write-Host "system-test\playwright-report\index.html" -ForegroundColor Yellow
}

function Stop-System {
    Write-Host "Stopping Docker containers (mode: $Mode)..." -ForegroundColor Cyan

    docker compose -f $ComposeFile down

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Services stopped successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Error stopping services" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

function Show-Logs {
    Write-Host "Viewing Docker container logs (mode: $Mode)..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to exit" -ForegroundColor Yellow
    Write-Host ""

    docker compose -f $ComposeFile logs --tail=100 -f
}

function Run-All {
    Build-System

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "Build failed! Aborting..." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    Start-System

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "Start failed! Aborting..." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    Write-Host ""
    $servicesReady = Wait-ForServices

    if (-not $servicesReady) {
        Write-Host ""
        Write-Host "Services failed to become ready! Aborting..." -ForegroundColor Red
        Stop-System
        exit 1
    }

    Test-System

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "Tests failed! Stopping services..." -ForegroundColor Red
        Stop-System
        exit $LASTEXITCODE
    }

    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "All tasks completed successfully!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
}

# Main execution
switch ($Command)
{
    "build" { Build-System }
    "start" { Start-System }
    "test"  { Test-System }
    "stop"  { Stop-System }
    "logs"  { Show-Logs }
    "all"   { Run-All }
}

