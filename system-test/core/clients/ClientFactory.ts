import { ShopUiClient } from './system/ui/ShopUiClient';
import { ShopApiClient } from './system/api/ShopApiClient';
import { ErpApiClient } from './external/erp/ErpApiClient';
import { TaxApiClient } from './external/tax/TaxApiClient';
import { TestConfiguration } from '../TestConfiguration';

export class ClientFactory {
  static async createShopUiClient(): Promise<ShopUiClient> {
    return await ShopUiClient.create(TestConfiguration.getShopUiBaseUrl());
  }

  static async createShopApiClient(): Promise<ShopApiClient> {
    return await ShopApiClient.create(TestConfiguration.getShopApiBaseUrl());
  }

  static async createErpApiClient(): Promise<ErpApiClient> {
    return await ErpApiClient.create(TestConfiguration.getErpApiBaseUrl());
  }

  static async createTaxApiClient(): Promise<TaxApiClient> {
    return await TaxApiClient.create(TestConfiguration.getTaxApiBaseUrl());
  }
}
