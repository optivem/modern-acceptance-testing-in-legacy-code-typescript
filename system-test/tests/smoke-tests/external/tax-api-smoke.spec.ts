import { test as base } from '../../fixtures.js';
import { expect } from '@playwright/test';
import { Closer } from '@optivem/util';
import { DriverFactory } from '../../../core/drivers/DriverFactory.js';
import { setupResultMatchers } from '@optivem/testing-assertions';

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
