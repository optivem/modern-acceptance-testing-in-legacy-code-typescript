export class TestConfiguration {
  private static readonly SHOP_UI_BASE_URL = process.env.SHOP_UI_BASE_URL || 'http://localhost:3001';
  private static readonly SHOP_API_BASE_URL = process.env.SHOP_API_BASE_URL || 'http://localhost:8081';
  private static readonly ERP_API_BASE_URL = process.env.ERP_API_BASE_URL || 'http://localhost:9001/erp';
  private static readonly TAX_API_BASE_URL = process.env.TAX_API_BASE_URL || 'http://localhost:9001/tax';

  static getShopUiBaseUrl(): string {
    return this.SHOP_UI_BASE_URL;
  }

  static getShopApiBaseUrl(): string {
    return this.SHOP_API_BASE_URL;
  }

  static getErpApiBaseUrl(): string {
    return this.ERP_API_BASE_URL;
  }

  static getTaxApiBaseUrl(): string {
    return this.TAX_API_BASE_URL;
  }
}
