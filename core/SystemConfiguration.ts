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