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
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=STUB CHANNEL=API npm test -- tests/acceptance-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-ui";
            Name = "Acceptance Tests - Channel: UI";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=STUB CHANNEL=UI npm test -- tests/acceptance-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{  Id = "contract-stub";
            Name = "External System Contract Tests - Stubbed External Systems";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=STUB npm test -- tests/external-system-contract-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{  Id = "contract-real";
            Name = "External System Contract Tests - Real External Systems";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=REAL npm test -- tests/external-system-contract-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{
            Id = "e2e";
            Name = "E2E Tests";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=REAL npm test -- tests/e2e-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{
            Id = "e2e-api";
            Name = "E2E Tests - Channel: API";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=REAL CHANNEL=API npm test -- tests/e2e-tests";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npm install",
                "npx playwright install chromium"
            ) },
        @{
            Id = "e2e-ui";
            Name = "E2E Tests - Channel: UI";
            Command = "npx cross-env EXTERNAL_SYSTEM_MODE=REAL CHANNEL=UI npm test -- tests/e2e-tests";
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

