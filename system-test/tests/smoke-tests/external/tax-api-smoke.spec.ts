import { test } from '@playwright/test';
import { ClientCloser } from '../../../core/clients/ClientCloser';
import { ClientFactory } from '../../../core/clients/ClientFactory';
import { TaxApiClient } from '../../../core/clients/external/tax/TaxApiClient';

test.describe('Tax API Smoke Tests', () => {
  let taxApiClient: TaxApiClient;

  test.beforeEach(async () => {
    taxApiClient = await ClientFactory.createTaxApiClient();
  });

  test.afterEach(async () => {
    await ClientCloser.close(taxApiClient);
  });

  test('should get home page successfully', async () => {
    const response = await taxApiClient.home().getHome();
    taxApiClient.home().assertGetHomeSuccessful(response);
  });
});
