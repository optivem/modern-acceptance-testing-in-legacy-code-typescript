/**
 * Fixture shape for v5 system DSL test (matches Java BaseSystemDslTest).
 * Holds app: SystemDsl (from core/dsl). Implement in system-test; test-infrastructure does not depend on core.
 */
export interface BaseSystemDslTestFixture {
    /** SystemDsl instance; type omitted to avoid core dependency */
    app: unknown;
}
