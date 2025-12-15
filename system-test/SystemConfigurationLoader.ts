export class SystemConfiguration {
  constructor(
    private readonly shopUiBaseUrl: string,
    private readonly shopApiBaseUrl: string,
    private readonly erpBaseUrl: string,
    private readonly taxBaseUrl: string
  ) {}

  getShopUiBaseUrl(): string {
    return this.shopUiBaseUrl;
  }

  getShopApiBaseUrl(): string {
    return this.shopApiBaseUrl;
  }

  getErpBaseUrl(): string {
    return this.erpBaseUrl;
  }

  getTaxBaseUrl(): string {
    return this.taxBaseUrl;
  }
}

export class SystemConfigurationLoader {
  static load(): SystemConfiguration {
    var shopUiBaseUrl = process.env.SHOP_UI_BASE_URL || 'http://localhost:3001';
    var shopApiBaseUrl = process.env.SHOP_API_BASE_URL || 'http://localhost:8081';
    var erpBaseUrl = process.env.ERP_API_BASE_URL || 'http://localhost:9001/erp';
    var taxBaseUrl = process.env.TAX_API_BASE_URL || 'http://localhost:9001/tax';

    return new SystemConfiguration(shopUiBaseUrl, shopApiBaseUrl, erpBaseUrl, taxBaseUrl);
  }
}
