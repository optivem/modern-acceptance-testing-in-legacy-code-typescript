/**
 * Fixture shape for v5 system DSL test (matches Java BaseSystemDslTest / .NET BaseSystemDslTest).
 * Holds app (SystemDsl). Types unknown to avoid core dependency; implement in system-test.
 *
 * Lifecycle (reference): setUp() loadConfiguration(), app = new SystemDsl(configuration); tearDown() Closer.close(app).
 */
export interface BaseSystemDslTestFixture {
    /** SystemDsl instance */
    app?: unknown;
}
