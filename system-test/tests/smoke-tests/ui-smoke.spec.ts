import { test } from '@playwright/test';
import { ClientFactory } from '../../core/clients/ClientFactory';
import { ClientCloser } from '../../core/clients/ClientCloser';

test('home should return HTML content', async () => {
  // Arrange
  const shopUiClient = await ClientFactory.createShopUiClient();

  try {
    // Act
    await shopUiClient.openHomePage();

    // Assert
    shopUiClient.assertHomePageLoaded();
  } finally {
    // Cleanup
    await ClientCloser.close(shopUiClient);
  }
});

