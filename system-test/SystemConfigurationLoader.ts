import type { ExternalSystemMode } from '@optivem/commons/dsl';
import { SystemConfiguration } from '../core/SystemConfiguration.js';
import { testConfig } from './test.config.js';

export class SystemConfigurationLoader {
  static load(externalSystemMode: ExternalSystemMode): SystemConfiguration {
    return new SystemConfiguration(
      testConfig.urls.shopUi,
      testConfig.urls.shopApi,
      testConfig.urls.erpApi,
      testConfig.urls.taxApi,
      externalSystemMode
    );
  }
}


