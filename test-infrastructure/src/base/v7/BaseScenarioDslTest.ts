/**
 * Fixture shape for v7 scenario DSL test.
 * Same as v6: app (SystemDsl), scenario (ScenarioDsl). Adds BrowserLifecycleExtension.
 * Types unknown to avoid core dependency; implement in system-test.
 * Lifecycle: loadConfiguration(), app = new SystemDsl(config), scenario = new ScenarioDsl(app); tearDown close(app).
 */
export interface BaseScenarioDslTestFixture {
    /** SystemDsl instance */
    app?: unknown;
    /** ScenarioDsl instance */
    scenario?: unknown;
}
