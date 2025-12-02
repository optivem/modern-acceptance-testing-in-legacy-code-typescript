import { test as base } from '../../fixtures.js';
import { expect } from '@playwright/test';
import { Closer } from '../../../core/drivers/commons/clients/Closer.js';
import { DriverFactory } from '../../../core/drivers/DriverFactory.js';
import { setupResultMatchers } from '../../../core/matchers/resultMatchers.js';

setupResultMatchers();

const test = base.extend({
  erpApiDriver: async ({}, use: any) => {
    const driver = DriverFactory.createErpApiDriver();
    await use(driver);
    await Closer.close(driver);
  },
});

test.describe('ERP API Smoke Tests', () => {
  test('should get home page successfully', async ({ erpApiDriver }) => {
    const result = await erpApiDriver.goToErp();
    expect(result).toBeSuccess();
  });
});
