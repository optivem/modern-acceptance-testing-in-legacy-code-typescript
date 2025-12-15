import { SystemConfiguration } from './core/SystemConfiguration.js';

export class SystemConfigurationLoader {
  static load(): SystemConfiguration {
    var shopUiBaseUrl = process.env.SHOP_UI_BASE_URL || 'http://localhost:3001';
    var shopApiBaseUrl = process.env.SHOP_API_BASE_URL || 'http://localhost:8081';
    var erpBaseUrl = process.env.ERP_API_BASE_URL || 'http://localhost:9001/erp';
    var taxBaseUrl = process.env.TAX_API_BASE_URL || 'http://localhost:9001/tax';

    return new SystemConfiguration(shopUiBaseUrl, shopApiBaseUrl, erpBaseUrl, taxBaseUrl);
  }
}
