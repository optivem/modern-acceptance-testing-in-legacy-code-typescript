import { test } from '@playwright/test';
import { ClientFactory } from '../../core/clients/ClientFactory';
import { ClientCloser } from '../../core/clients/ClientCloser';

test('echo should return 200 OK', async () => {
  // Arrange
  const shopApiClient = await ClientFactory.createShopApiClient();

  try {
    // Act
    const response = await shopApiClient.echo().echo();

    // Assert
    await shopApiClient.echo().assertEchoSuccessful(response);
  } finally {
    // Cleanup
    await ClientCloser.close(shopApiClient);
  }
});

