import type { ExternalSystemMode } from '@optivem/commons/dsl';
import type { LoadedConfiguration } from '@optivem/test-infrastructure';
import { setConfigurationLoader } from '@optivem/test-infrastructure';
import { testConfig } from './test.config.js';

setConfigurationLoader((mode: ExternalSystemMode): LoadedConfiguration => ({
    shopUiBaseUrl: testConfig.urls.shopUi,
    shopApiBaseUrl: testConfig.urls.shopApi,
    erpBaseUrl: testConfig.urls.erpApi,
    taxBaseUrl: testConfig.urls.taxApi,
    clockBaseUrl: testConfig.urls.clockApi,
    externalSystemMode: mode,
}));
