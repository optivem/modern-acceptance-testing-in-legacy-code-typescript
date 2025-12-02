import { test } from '@playwright/test';
import { BaseShopSmokeTest } from '../BaseShopSmokeTest.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';

class ShopUiSmokeTest extends BaseShopSmokeTest {
  createDriver(): ShopDriver {
    return DriverFactory.createShopUiDriver();
  }
}

test.describe('UI Smoke Tests', () => {
  let testInstance: ShopUiSmokeTest;

  test.beforeEach(async () => {
    testInstance = new ShopUiSmokeTest();
    await testInstance.setUp();
  });

  test.afterEach(async () => {
    await testInstance.tearDown();
  });

  test('should be able to go to shop', async () => {
    await testInstance.shouldBeAbleToGoToShop();
  });
});
