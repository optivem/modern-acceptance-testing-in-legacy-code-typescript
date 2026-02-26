/**
 * Fixture shape for v5 system DSL test.
 * Holds app (SystemDsl). Types unknown to avoid core dependency; implement in system-test.
 * Lifecycle: loadConfiguration(), app = new SystemDsl(configuration); tearDown Closer.close(app).
 */
export interface BaseSystemDslTestFixture {
    /** SystemDsl instance */
    app?: unknown;
}
