import { test } from '@playwright/test';
import { ClientFactory } from '../../core/clients/ClientFactory';
import { ClientCloser } from '../../core/clients/ClientCloser';
import { ShopApiClient } from '../../core/clients/system/api/ShopApiClient';

let shopApiClient: ShopApiClient;

test.beforeEach(async () => {
  shopApiClient = await ClientFactory.createShopApiClient();
});

test.afterEach(async () => {
  await ClientCloser.close(shopApiClient);
});

test('echo should return 200 OK', async () => {
  // Act
  const response = await shopApiClient.echo().echo();

  // Assert
  await shopApiClient.echo().assertEchoSuccessful(response);
});

