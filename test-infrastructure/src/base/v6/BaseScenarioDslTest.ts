/**
 * Fixture shape for v6 scenario DSL test (matches Java BaseScenarioDslTest v6).
 * Holds app (SystemDsl) and scenario (ScenarioDsl). Implement in system-test.
 */
export interface BaseScenarioDslTestFixture {
    app: unknown;
    scenario: unknown;
}
