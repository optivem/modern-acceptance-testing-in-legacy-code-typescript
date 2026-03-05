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

        # === Smoke ===
        @{  Id = "smoke";
            Name = "Smoke Tests";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === Acceptance ===
        @{  Id = "acceptance-api";
            Name = "Acceptance Tests - Channel: API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-ui";
            Name = "Acceptance Tests - Channel: UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-isolated-api";
            Name = "Acceptance Tests (Isolated) - Channel: API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "acceptance-isolated-ui";
            Name = "Acceptance Tests (Isolated) - Channel: UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === External System Contract Tests ===
        @{  Id = "contract-stub";
            Name = "External System Contract Tests - Stubbed External Systems";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=external-system-contract-test --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "contract-real";
            Name = "External System Contract Tests - Real External Systems";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=external-system-contract-test --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === E2E Tests ===
        @{  Id = "e2e-no-channel";
            Name = "E2E Tests - No Channel (v1, v2, v3)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=e2e-test tests/e2e-test/v1 tests/e2e-test/v2 tests/e2e-test/v3";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "e2e-api";
            Name = "E2E Tests - Channel: API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; `$env:CHANNEL='API'; npx playwright test --project=e2e-test";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "e2e-ui";
            Name = "E2E Tests - Channel: UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; `$env:CHANNEL='UI'; npx playwright test --project=e2e-test";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) }
    )
}

# Export the configuration
return $Config
