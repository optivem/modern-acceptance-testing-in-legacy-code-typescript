import { ExternalSystemMode } from '@optivem/commons/dsl';

export class SystemConfiguration {
  constructor(
    private readonly shopUiBaseUrl: string,
    private readonly shopApiBaseUrl: string,
    private readonly erpBaseUrl: string,
    private readonly taxBaseUrl: string,
    private readonly externalSystemMode: ExternalSystemMode = ExternalSystemMode.REAL,
    private readonly clockBaseUrl: string = ''
  ) {}

  getExternalSystemMode(): ExternalSystemMode {
    return this.externalSystemMode;
  }

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

  getClockBaseUrl(): string {
    return this.clockBaseUrl;
  }
}

