import { test, expect } from '@playwright/test';
import { BaseE2eTest } from '../BaseE2eTest.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';
import { OrderStatus } from '../../core/drivers/system/commons/enums/OrderStatus.js';
import { ResultAssert } from '../../core/drivers/commons/ResultAssert.js';

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

  test('placeOrder should return order number', async () => {
    // Arrange
    const sku = `ABC-${crypto.randomUUID()}`;
    const createProductResult = await testInstance.erpApiDriver.createProduct(sku, '20.00');
    ResultAssert.assertSuccess(createProductResult);

    // Act
    const placeOrderResult = await testInstance.shopDriver.placeOrder(sku, '5', 'US');

    // Assert
    ResultAssert.assertSuccess(placeOrderResult);
    const orderNumber = placeOrderResult.getValue().orderNumber;
    expect(orderNumber).toBeTruthy();
    expect(orderNumber).toMatch(/^ORD-/);
  });

  test('getOrder should return order details', async () => {
    // Arrange
    const sku = `DEF-${crypto.randomUUID()}`;
    const unitPrice = '30.00';
    const quantity = '3';
    const country = 'US';

    const createProductResult = await testInstance.erpApiDriver.createProduct(sku, unitPrice);
    ResultAssert.assertSuccess(createProductResult);

    // Place order
    const placeOrderResult = await testInstance.shopDriver.placeOrder(sku, quantity, country);
    ResultAssert.assertSuccess(placeOrderResult);
    const orderNumber = placeOrderResult.getValue().orderNumber;

    // Act
    const viewOrderResult = await testInstance.shopDriver.viewOrder(orderNumber);

    // Assert
    ResultAssert.assertSuccess(viewOrderResult);
    const orderDetails = viewOrderResult.getValue();

    expect(orderDetails.orderNumber).toBe(orderNumber);
    expect(orderDetails.sku).toBe(sku);
    expect(orderDetails.quantity).toBe(3);
    expect(orderDetails.country).toBe(country);
    expect(orderDetails.unitPrice).toBe(Number(unitPrice));
    expect(orderDetails.status).toBe(OrderStatus.PLACED);
  });

  test('cancelOrder should set status to CANCELLED', async () => {
    // Arrange
    const sku = `XYZ-${crypto.randomUUID()}`;
    const createProductResult = await testInstance.erpApiDriver.createProduct(sku, '50.00');
    ResultAssert.assertSuccess(createProductResult);

    const placeOrderResult = await testInstance.shopDriver.placeOrder(sku, '2', 'US');
    ResultAssert.assertSuccess(placeOrderResult);
    const orderNumber = placeOrderResult.getValue().orderNumber;

    // Act
    const cancelOrderResult = await testInstance.shopDriver.cancelOrder(orderNumber);

    // Assert
    ResultAssert.assertSuccess(cancelOrderResult);

    // Verify order status is CANCELLED
    const viewOrderResult = await testInstance.shopDriver.viewOrder(orderNumber);
    ResultAssert.assertSuccess(viewOrderResult);
    expect(viewOrderResult.getValue().status).toBe(OrderStatus.CANCELLED);
  });

  test('should reject order with null quantity', async () => {
    const result = await testInstance.shopDriver.placeOrder('some-sku', null as any, 'US');
    ResultAssert.assertFailureWithMessage(result, 'Quantity must not be empty');
  });

  test('should reject order with null SKU', async () => {
    const result = await testInstance.shopDriver.placeOrder(null as any, '5', 'US');
    ResultAssert.assertFailureWithMessage(result, 'SKU must not be empty');
  });

  test('should reject order with null country', async () => {
    const result = await testInstance.shopDriver.placeOrder('some-sku', '5', null as any);
    ResultAssert.assertFailureWithMessage(result, 'Country must not be empty');
  });
});
