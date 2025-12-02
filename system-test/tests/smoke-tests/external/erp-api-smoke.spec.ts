import { test, expect } from '@playwright/test';
import { Closer } from '../../../core/drivers/commons/clients/Closer.js';
import { DriverFactory } from '../../../core/drivers/DriverFactory.js';
import { ErpApiDriver } from '../../../core/drivers/external/erp/api/ErpApiDriver.js';
import { setupResultMatchers } from '../../../core/matchers/resultMatchers.js';

setupResultMatchers();

test.describe('ERP API Smoke Tests', () => {
  let erpApiDriver: ErpApiDriver;

  test.beforeEach(() => {
    erpApiDriver = DriverFactory.createErpApiDriver();
  });

  test.afterEach(async () => {
    await Closer.close(erpApiDriver);
  });

  test('should get home page successfully', async () => {
    const result = await erpApiDriver.goToErp();
    expect(result).toBeSuccess();
  });
});
