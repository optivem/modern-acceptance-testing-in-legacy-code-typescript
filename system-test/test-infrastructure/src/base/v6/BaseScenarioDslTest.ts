/**
 * Fixture shape for v6 scenario DSL test.
 * Holds app (SystemDsl) and scenario (ScenarioDsl). Types unknown to avoid core dependency; implement in system-test.
 * Lifecycle: loadConfiguration(), app = new SystemDsl(config), scenario = new ScenarioDsl(app); tearDown close(app).
 */
export interface BaseScenarioDslTestFixture {
    /** SystemDsl instance */
    app?: unknown;
    /** ScenarioDsl instance */
    scenario?: unknown;
}
