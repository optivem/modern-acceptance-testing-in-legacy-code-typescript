import { test } from '@playwright/test';
import { Closer } from '../../../core/drivers/commons/clients/Closer.js';
import { DriverFactory } from '../../../core/drivers/DriverFactory.js';
import { ErpApiDriver } from '../../../core/drivers/external/erp/api/ErpApiDriver.js';
import { ResultAssert } from '../../../core/drivers/commons/ResultAssert.js';

test.describe('ERP API Smoke Tests', () => {
  let erpApiDriver: ErpApiDriver;

  test.beforeEach(() => {
    erpApiDriver = DriverFactory.createErpApiDriver();
  });

  test.afterEach(async () => {
    await Closer.close(erpApiDriver);
  });

  test('should get home page successfully', async () => {
    const result = await erpApiDriver.checkHome();
    ResultAssert.assertSuccess(result);
  });

  test('should get products successfully', async () => {
    const result = await erpApiDriver.getProducts();
    ResultAssert.assertSuccess(result);
  });
});
