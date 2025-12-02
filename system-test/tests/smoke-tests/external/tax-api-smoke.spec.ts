import { test as base } from '../../fixtures.js';
import { expect } from '@playwright/test';
import { Closer } from '../../../core/drivers/commons/clients/Closer.js';
import { DriverFactory } from '../../../core/drivers/DriverFactory.js';
import { setupResultMatchers } from '../../../core/matchers/resultMatchers.js';

setupResultMatchers();

const test = base.extend({
  taxApiDriver: async ({}, use: any) => {
    const driver = DriverFactory.createTaxApiDriver();
    await use(driver);
    await Closer.close(driver);
  },
});

test.describe('Tax API Smoke Tests', () => {
  test('should get home page successfully', async ({ taxApiDriver }) => {
    const result = await taxApiDriver.goToTax();
    expect(result).toBeSuccess();
  });
});
