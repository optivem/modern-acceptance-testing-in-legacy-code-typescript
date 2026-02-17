# System Test Configuration
# This file contains configuration values for Run-SystemTests.ps1

$Config = @{

    BuildCommands = @(
        @{  Name = "Clean Install";
            Command = "npm ci"
        },
        @{  Name = "Build Base Packages";
            Command = "npm run build"
        },
        @{  Name = "Build All Packages";
            Command = "npm run build --workspaces --if-present"
        }
    )

    Tests = @(
        @{  Id = "smoke";
            Name = "Smoke Tests";
            Command = "npm test -- tests/smoke-tests";
            Path = "system-test";
            TestReportPath = "playwright-report/index.html"
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{ 
            Id = "e2e";
            Name = "E2E Tests";
            Command = "npm test -- tests/e2e-tests";
            Path = "system-test";
            TestReportPath = "playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) }
    )
}

# Export the configuration
return $Config

