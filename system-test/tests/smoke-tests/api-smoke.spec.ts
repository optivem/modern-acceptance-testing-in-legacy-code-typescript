import { test, expect } from '@playwright/test';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';

class ShopApiSmokeTest {
  public shopDriver!: ShopDriver;

  createDriver(): ShopDriver {
    return DriverFactory.createShopApiDriver();
  }

  async setUp() {
    this.shopDriver = this.createDriver();
  }

  async tearDown() {
    if (this.shopDriver) {
      this.shopDriver.close();
    }
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
    const result = await testInstance.shopDriver.goToShop();
    expect(result.isSuccess()).toBe(true);
  });
});
