import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v4 channel driver test (matches Java BaseChannelDriverTest / .NET BaseChannelDriverTest).
 * Same as v3 but shopDriver is chosen by channel (UI vs API) from ChannelContext/ChannelExtension.
 * Types are unknown to avoid core dependency; implement in system-test with channelTest + DriverFactory.
 *
 * Lifecycle (reference): setUp() loads configuration, createShopDriver(config) by channel, erpDriver, taxDriver; tearDown().
 */
export interface BaseChannelDriverTestFixture {
    /** Resolved config (used in setUp; may not be stored on fixture in reference) */
    configuration?: LoadedConfiguration;
    /** Shop driver for current channel (UI or API) */
    shopDriver?: unknown;
    /** ERP driver */
    erpDriver?: unknown;
    /** Tax driver */
    taxDriver?: unknown;
}
