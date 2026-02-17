import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v4 channel driver test (matches Java BaseChannelDriverTest).
 * Same as v3 but shopDriver is chosen by channel (UI vs API).
 * Implement in system-test with channelTest + DriverFactory.
 */
export interface BaseChannelDriverTestFixture {
    configuration: LoadedConfiguration;
}
