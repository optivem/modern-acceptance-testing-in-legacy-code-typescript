import { test } from '@playwright/test';
import { ClientFactory } from '../../core/clients/ClientFactory';
import { ClientCloser } from '../../core/clients/ClientCloser';
import { ShopUiClient } from '../../core/clients/system/ui/ShopUiClient';

let shopUiClient: ShopUiClient;

test.beforeEach(async () => {
  shopUiClient = await ClientFactory.createShopUiClient();
});

test.afterEach(async () => {
  await ClientCloser.close(shopUiClient);
});

test('home should return HTML content', async () => {
  // Act
  await shopUiClient.openHomePage();

  // Assert
  shopUiClient.assertHomePageLoaded();
});

