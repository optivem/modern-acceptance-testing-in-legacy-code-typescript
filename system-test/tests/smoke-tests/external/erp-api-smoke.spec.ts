import '../../../setup-config.js';
import { test as base } from '../../fixtures.js';
import { expect } from '@playwright/test';
import { Closer } from '@optivem/commons/util';
import { createErpDriver } from '@optivem/test-infrastructure';
import { setupResultMatchers } from '@optivem/commons/util';
import { getExternalSystemMode } from '../../../test.config.js';

setupResultMatchers();

const test = base.extend({
  erpApiDriver: async ({}, use: any) => {
    const driver = createErpDriver(getExternalSystemMode());
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


