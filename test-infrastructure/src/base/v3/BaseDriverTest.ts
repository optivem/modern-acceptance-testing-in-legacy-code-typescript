import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v3 driver test (matches Java BaseDriverTest).
 * Holds configuration and drivers: shopDriver, erpDriver, taxDriver.
 * Implement in system-test with DriverFactory or equivalent.
 */
export interface BaseDriverTestFixture {
    configuration: LoadedConfiguration;
}
