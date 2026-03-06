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

        # === v1: Raw ===
        @{  Id = "v1-smoke";
            Name = "v1 (raw) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/v1/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v1-e2e";
            Name = "v1 (raw) - E2E (real)";
            Command = "npx playwright test --project=e2e-test tests/v1/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === v2: Clients ===
        @{  Id = "v2-smoke";
            Name = "v2 (clients) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/v2/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v2-e2e";
            Name = "v2 (clients) - E2E (real)";
            Command = "npx playwright test --project=e2e-test tests/v2/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === v3: Drivers ===
        @{  Id = "v3-smoke";
            Name = "v3 (drivers) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/v3/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v3-e2e";
            Name = "v3 (drivers) - E2E (real)";
            Command = "npx playwright test --project=e2e-test tests/v3/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === v4: Channels ===
        @{  Id = "v4-smoke";
            Name = "v4 (channels) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/v4/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v4-e2e-api";
            Name = "v4 (channels) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/v4/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v4-e2e-ui";
            Name = "v4 (channels) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/v4/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === v5: App DSL ===
        @{  Id = "v5-smoke";
            Name = "v5 (app dsl) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/v5/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v5-e2e-api";
            Name = "v5 (app dsl) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/v5/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v5-e2e-ui";
            Name = "v5 (app dsl) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/v5/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === v6: Scenario DSL ===
        @{  Id = "v6-smoke";
            Name = "v6 (scenario dsl) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/v6/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v6-e2e-api";
            Name = "v6 (scenario dsl) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/v6/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v6-e2e-ui";
            Name = "v6 (scenario dsl) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/v6/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },

        # === v7: Scenario DSL (full) ===
        @{  Id = "v7-smoke-stub";
            Name = "v7 (scenario dsl) - Smoke (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=smoke-test tests/v7/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v7-smoke-real";
            Name = "v7 (scenario dsl) - Smoke (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=smoke-test tests/v7/smoke";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v7-acceptance-api";
            Name = "v7 (scenario dsl) - Acceptance (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v7-acceptance-ui";
            Name = "v7 (scenario dsl) - Acceptance (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test --grep-invert `"@isolated`"";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v7-acceptance-isolated-api";
            Name = "v7 (scenario dsl) - Acceptance Isolated (stub) - API";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='API'; npx playwright test --project=acceptance-test --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v7-acceptance-isolated-ui";
            Name = "v7 (scenario dsl) - Acceptance Isolated (stub) - UI";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; `$env:CHANNEL='UI'; npx playwright test --project=acceptance-test --grep `"@isolated`" --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v7-contract-stub";
            Name = "v7 (scenario dsl) - Contract (stub)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='STUB'; npx playwright test --project=external-system-contract-test --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v7-contract-real";
            Name = "v7 (scenario dsl) - Contract (real)";
            Command = "`$env:EXTERNAL_SYSTEM_MODE='REAL'; npx playwright test --project=external-system-contract-test --workers=1";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v7-e2e-api";
            Name = "v7 (scenario dsl) - E2E (real) - API";
            Command = "`$env:CHANNEL='API'; npx playwright test --project=e2e-test tests/v7/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) },
        @{  Id = "v7-e2e-ui";
            Name = "v7 (scenario dsl) - E2E (real) - UI";
            Command = "`$env:CHANNEL='UI'; npx playwright test --project=e2e-test tests/v7/e2e";
            Path = "system-test";
            TestReportPath = "system-test/playwright-report/index.html";
            TestInstallCommands = @(
                "npx playwright install chromium"
            ) }
    )
}

# Export the configuration
return $Config
