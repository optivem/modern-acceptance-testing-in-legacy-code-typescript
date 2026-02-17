import type { ExternalSystemMode } from '@optivem/commons/dsl';

/**
 * Shape of loaded test configuration (matches Java/.NET SystemConfiguration used by tests).
 * Consumers can build their own SystemConfiguration from this.
 */
export interface LoadedConfiguration {
    shopUiBaseUrl: string;
    shopApiBaseUrl: string;
    erpBaseUrl: string;
    taxBaseUrl: string;
    clockBaseUrl: string;
    externalSystemMode: ExternalSystemMode;
}
