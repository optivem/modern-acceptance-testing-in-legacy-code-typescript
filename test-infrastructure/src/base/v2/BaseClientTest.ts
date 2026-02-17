import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v2 client test (matches Java BaseClientTest / .NET BaseClientTest).
 * Holds configuration and clients: shop UI client, shop API client, ERP client, tax client.
 * Types are unknown to avoid core dependency; implement in system-test with real client types.
 *
 * Lifecycle (reference): setUpConfiguration(), setUpShopUiClient(), setUpShopApiClient(), setUpExternalClients(), tearDown().
 * Helper (reference): createUniqueSku(baseSku).
 */
export interface BaseClientTestFixture {
    configuration: LoadedConfiguration;
    /** Shop UI client (e.g. Playwright-based) */
    shopUiClient?: unknown;
    /** Shop API client */
    shopApiClient?: unknown;
    /** ERP client */
    erpClient?: unknown;
    /** Tax client */
    taxClient?: unknown;
}
