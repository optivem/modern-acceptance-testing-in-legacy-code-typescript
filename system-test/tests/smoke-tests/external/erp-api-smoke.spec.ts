import { test } from '@playwright/test';
import { ClientCloser } from '../../../core/clients/ClientCloser';
import { ClientFactory } from '../../../core/clients/ClientFactory';
import { ErpApiClient } from '../../../core/clients/external/erp/ErpApiClient';

test.describe('ERP API Smoke Tests', () => {
  let erpApiClient: ErpApiClient;

  test.beforeEach(async () => {
    erpApiClient = await ClientFactory.createErpApiClient();
  });

  test.afterEach(async () => {
    await ClientCloser.close(erpApiClient);
  });

  test('should get home page successfully', async () => {
    const response = await erpApiClient.home().getHome();
    erpApiClient.home().assertGetHomeSuccessful(response);
  });
});
