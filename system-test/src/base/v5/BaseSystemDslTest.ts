/**
 * Fixture shape for v5 system DSL test.
 * Holds app (AppDsl). Types unknown to avoid core dependency; implement in system-test.
 * Lifecycle: loadConfiguration(), app = new AppDsl(configuration); tearDown Closer.close(app).
 */
export interface BaseSystemDslTestFixture {
    /** AppDsl instance */
    app?: unknown;
}
