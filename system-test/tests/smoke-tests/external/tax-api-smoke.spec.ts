import { test } from '@playwright/test';
import { Closer } from '../../../core/drivers/commons/clients/Closer.js';
import { DriverFactory } from '../../../core/drivers/DriverFactory.js';
import { TaxApiDriver } from '../../../core/drivers/external/tax/api/TaxApiDriver.js';
import { ResultAssert } from '../../../core/drivers/commons/ResultAssert.js';

test.describe('Tax API Smoke Tests', () => {
  let taxApiDriver: TaxApiDriver;

  test.beforeEach(() => {
    taxApiDriver = DriverFactory.createTaxApiDriver();
  });

  test.afterEach(async () => {
    await Closer.close(taxApiDriver);
  });

  test('should get home page successfully', async () => {
    const result = await taxApiDriver.goToTax();
    ResultAssert.assertSuccess(result);
  });
});
