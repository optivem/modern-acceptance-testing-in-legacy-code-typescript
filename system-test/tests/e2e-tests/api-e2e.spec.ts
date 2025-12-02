import { test } from '@playwright/test';
import { BaseE2eTest } from '../BaseE2eTest.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';

class ApiE2eTest extends BaseE2eTest {
  createDriver(): ShopDriver {
    return DriverFactory.createShopApiDriver();
  }
}

test.describe('API E2E Tests', () => {
  let testInstance: ApiE2eTest;

  test.beforeEach(async () => {
    testInstance = new ApiE2eTest();
    await testInstance.setUp();
  });

  test.afterEach(async () => {
    await testInstance.tearDown();
  });

  test('should place order and calculate original price', async () => {
    await testInstance.shouldPlaceOrderAndCalculateOriginalPrice();
  });

  test('should cancel order', async () => {
    await testInstance.shouldCancelOrder();
  });

  test('should reject order with null quantity', async () => {
    await testInstance.shouldRejectOrderWithNullQuantity();
  });

  test('should reject order with null SKU', async () => {
    await testInstance.shouldRejectOrderWithNullSku();
  });

  test('should reject order with null country', async () => {
    await testInstance.shouldRejectOrderWithNullCountry();
  });

  test('should not cancel non-existent order', async () => {
    await testInstance.shouldNotCancelNonExistentOrder();
  });

  test('should not cancel already cancelled order', async () => {
    await testInstance.shouldNotCancelAlreadyCancelledOrder();
  });
});
