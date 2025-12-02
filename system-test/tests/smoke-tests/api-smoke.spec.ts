import { test } from '@playwright/test';
import { BaseShopSmokeTest } from '../BaseShopSmokeTest.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';

class ShopApiSmokeTest extends BaseShopSmokeTest {
  createDriver(): ShopDriver {
    return DriverFactory.createShopApiDriver();
  }
}

test.describe('API Smoke Tests', () => {
  let testInstance: ShopApiSmokeTest;

  test.beforeEach(async () => {
    testInstance = new ShopApiSmokeTest();
    await testInstance.setUp();
  });

  test.afterEach(async () => {
    await testInstance.tearDown();
  });

  test('should be able to go to shop', async () => {
    await testInstance.shouldBeAbleToGoToShop();
  });
});
