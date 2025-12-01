import { test, expect } from '@playwright/test';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';

class ShopUiSmokeTest {
  public shopDriver!: ShopDriver;

  createDriver(): ShopDriver {
    return DriverFactory.createShopUiDriver();
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
    const result = await testInstance.shopDriver.goToShop();
    expect(result.isSuccess()).toBe(true);
  });
});
