import { test } from '@playwright/test';
import { BaseE2eTest } from '../BaseE2eTest.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';

class UiE2eTest extends BaseE2eTest {
  createDriver(): ShopDriver {
    return DriverFactory.createShopUiDriver();
  }
}

test.describe('UI E2E Tests', () => {
  let testInstance: UiE2eTest;

  test.beforeEach(async () => {
    testInstance = new UiE2eTest();
    await testInstance.setUp();
  });

  test.afterEach(async () => {
    await testInstance.tearDown();
  });

  // UI E2E tests inherit all test methods from BaseE2eTest
  // The only difference from API E2E tests is the driver implementation (UI vs API)
});
