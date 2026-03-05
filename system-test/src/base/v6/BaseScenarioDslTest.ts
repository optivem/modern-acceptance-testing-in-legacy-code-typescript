/**
 * Fixture shape for v6 scenario DSL test.
 * Holds app (AppDsl) and scenario (ScenarioDsl). Types unknown to avoid core dependency; implement in system-test.
 * Lifecycle: loadConfiguration(), app = new AppDsl(config), scenario = new ScenarioDsl(app); tearDown close(app).
 */
export interface BaseScenarioDslTestFixture {
    /** AppDsl instance */
    app?: unknown;
    /** ScenarioDsl instance */
    scenario?: unknown;
}
