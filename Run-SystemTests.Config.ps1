# System Test Configuration
# This file contains configuration values for Run-SystemTests.ps1

$Config = @{

    BuildCommands = @(
        @{  Name = "Clean Install";
            Command = "npm ci"
        },
        @{  Name = "Build Packages";
            Command = "npm run build"
        }
    )

    Tests = @(
        @{  Id = "smoke";
            Name = "Smoke Tests";
            Command = "npm test -- tests/smoke-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html"
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-api";
            Name = "Acceptance Tests - Channel: API";
            Command = "npx cross-env CHANNEL=API npm test -- tests/acceptance-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-ui";
            Name = "Acceptance Tests - Channel: UI";
            Command = "npx cross-env CHANNEL=UI npm test -- tests/acceptance-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{
            Id = "e2e";
            Name = "E2E Tests";
            Command = "npm test -- tests/e2e-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) }
    )
}

# Export the configuration
return $Config

