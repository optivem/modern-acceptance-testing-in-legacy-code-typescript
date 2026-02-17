/**
 * Fixture shape for v6 scenario DSL test (matches Java BaseScenarioDslTest v6).
 * Holds app (SystemDsl) and scenario (ScenarioDsl). Types unknown to avoid core dependency; implement in system-test.
 *
 * Lifecycle (reference): setUp() loadConfiguration(), app = new SystemDsl(config), scenario = new ScenarioDsl(app); tearDown() close(app).
 * Extensions: ChannelExtension.
 */
export interface BaseScenarioDslTestFixture {
    /** SystemDsl instance (private in Java, exposed here for fixture shape) */
    app?: unknown;
    /** ScenarioDsl instance */
    scenario?: unknown;
}
