import { describe, test, beforeEach, afterEach } from '@jest/globals';
import { Closer } from '../../../core/drivers/commons/clients/Closer.js';
import { DriverFactory } from '../../../core/drivers/DriverFactory.js';
import { ErpApiDriver } from '../../../core/drivers/external/erp/api/ErpApiDriver.js';
import { ResultAssert } from '../../../core/drivers/commons/ResultAssert.js';

describe('ERP API Smoke Tests', () => {
  let erpApiDriver: ErpApiDriver;

  beforeEach(() => {
    erpApiDriver = DriverFactory.createErpApiDriver();
  });

  afterEach(async () => {
    await Closer.close(erpApiDriver);
  });

  test('should get home page successfully', async () => {
    const result = await erpApiDriver.goToErp();
    ResultAssert.assertSuccess(result);
  });
});
