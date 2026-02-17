import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v2 client test (matches Java BaseClientTest).
 * Holds configuration and clients: shop UI client, shop API client, ERP client, tax client.
 * Implement in system-test with real clients from core.
 */
export interface BaseClientTestFixture {
    configuration: LoadedConfiguration;
}
