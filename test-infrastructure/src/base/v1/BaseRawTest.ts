import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v1 raw test (matches Java BaseRawTest).
 * Holds configuration, Playwright browser/page, HTTP clients.
 * Implement in system-test with real Playwright and fetch/axios.
 */
export interface BaseRawTestFixture {
    configuration: LoadedConfiguration;
}
