# System Test Configuration
# This file contains configuration values for Run-SystemTests.ps1

$Config = @{
    # Test Configuration
    TestInstallCommands = @(
        "npm install",
        "npx playwright install chromium"
    )
    SmokeTestCommand = "npm test -- tests/smoke-tests"
    E2ETestCommand = "npm test -- tests/e2e-tests"
    TestReportPath = "playwright-report/index.html"
}

# Export the configuration
return $Config

