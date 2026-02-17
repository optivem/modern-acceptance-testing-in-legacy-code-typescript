# Reference projects – dependency comparison

Checked against:
- **Java:** `C:\GitHub\optivem\modern-acceptance-testing-in-legacy-code-java`
- **.NET:** `C:\GitHub\optivem\modern-acceptance-testing-in-legacy-code-dotnet`

---

## Java (Gradle)

| Project | Depends on |
|--------|------------|
| **commons** | (external only: Lombok, Jackson, Spring, Playwright, JUnit, AssertJ, WireMock) |
| **test-infrastructure** | `:commons`, `:core` (+ optivem-testing, Spring, etc.) |
| **dsl** | `:dsl:system`, `:dsl:gherkin` |
| **dsl/system** | `:core:clock`, `:core:erp`, `:core:shop`, `:core:tax`, `:commons` |
| **dsl/gherkin** | `:dsl:system` |
| **core** | (parent/aggregator) |
| **system-test/smoke-test** | `testImplementation project(':test-infrastructure')` |
| **system-test/acceptance-test** | `testImplementation project(':test-infrastructure')` |
| **system-test/e2e-test** | `testImplementation project(':test-infrastructure')` |
| **system-test/external-system-contract-test** | `testImplementation project(':test-infrastructure')` |

**Note:** `BaseScenarioDslTest` (in test-infrastructure) uses `SystemDsl` and `ScenarioDsl` (from dsl). test-infrastructure’s `build.gradle` only declares `:commons` and `:core`; it does **not** declare `:dsl`. So either `:core` (or another path) brings in dsl transitively, or the Java reference is missing an explicit `project(':dsl')` in test-infrastructure.

---

## .NET (csproj)

| Project | ProjectReference(s) |
|--------|----------------------|
| **Commons** | (none) |
| **Core.Shop** (and other Core.*) | Commons |
| **Dsl.System** | Core.Clock, Core.Erp, Core.Shop, Core.Tax, Commons |
| **Dsl.Gherkin** | Dsl.System, Core.Shop |
| **TestInfrastructure** | **Dsl.System**, **Dsl.Gherkin** |
| **SmokeTests** | TestInfrastructure, Commons |
| **AcceptanceTests** | TestInfrastructure, Commons |
| **E2eTests** | TestInfrastructure, Commons |
| **ExternalSystemContractTests** | (not read; likely TestInfrastructure) |

Test projects get DSL **only** via TestInfrastructure (no direct reference to Dsl).

---

## TypeScript (npm workspaces)

| Package | dependencies |
|---------|----------------|
| **commons** | (none internal) |
| **core** | (none in package.json; may use commons via workspace) |
| **dsl** | @optivem/commons, @optivem/core |
| **test-infrastructure** | @optivem/commons, @optivem/core, @optivem/optivem-testing |
| **system-test** | @optivem/commons, @optivem/core, **@optivem/dsl**, @optivem/optivem-testing, @optivem/test-infrastructure |

---

## Alignment summary

| Aspect | Java | .NET | TypeScript |
|--------|------|------|------------|
| **Test project depends on** | test-infrastructure only | TestInfrastructure (+ Commons) | test-infrastructure **and** dsl |
| **Who depends on dsl** | Unclear (test-infrastructure uses it but doesn’t declare `:dsl`) | TestInfrastructure | system-test (and dsl → core, commons) |
| **test-infrastructure depends on dsl?** | No (only commons, core) | **Yes** (Dsl.System, Dsl.Gherkin) | **No** (commons, core, optivem-testing) |

To mirror .NET: **test-infrastructure** could depend on **@optivem/dsl** and system-test could drop its direct dsl dependency (get it transitively via test-infrastructure). That would match .NET where SmokeTests only reference TestInfrastructure and get DSL through it.

Current TypeScript setup (system-test → dsl + test-infrastructure) is valid; the main difference is that in .NET, test projects do not reference Dsl directly.
