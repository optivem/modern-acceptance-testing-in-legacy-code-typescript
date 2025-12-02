import { test as base, expect } from './fixtures.js';
import { DriverFactory } from '../core/drivers/DriverFactory.js';
import { OrderStatus } from '../core/drivers/system/commons/enums/OrderStatus.js';
import { ResultAssert } from '../core/drivers/commons/ResultAssert.js';

export const test = base.extend({
    erpApiDriver: async ({}, use) => {
        const driver = DriverFactory.createErpApiDriver();
        await use(driver);
        await driver.close();
    },

    taxApiDriver: async ({}, use) => {
        const driver = DriverFactory.createTaxApiDriver();
        await use(driver);
        await driver.close();
    },
});

export function createE2eTests() {
    test('should place order and calculate original price', async ({ shopDriver, erpApiDriver }) => {
        // Arrange
        const sku = `ABC-${crypto.randomUUID()}`;
        const createProductResult = await erpApiDriver.createProduct(sku, '20.00');
        ResultAssert.assertSuccess(createProductResult);

        // Act
        const placeOrderResult = await shopDriver.placeOrder(sku, '5', 'US');

        // Assert
        ResultAssert.assertSuccess(placeOrderResult);
        const orderNumber = placeOrderResult.getValue().orderNumber;
        expect(orderNumber).toBeTruthy();
        expect(orderNumber).toMatch(/^ORD-/);

        const viewOrderResult = await shopDriver.viewOrder(orderNumber);
        ResultAssert.assertSuccess(viewOrderResult);
        const orderDetails = viewOrderResult.getValue();

        expect(orderDetails.orderNumber).toBe(orderNumber);
        expect(orderDetails.sku).toBe(sku);
        expect(orderDetails.quantity).toBe(5);
        expect(orderDetails.country).toBe('US');
        expect(orderDetails.unitPrice).toBe(20.00);
        expect(orderDetails.originalPrice).toBe(100.00);
        expect(orderDetails.status).toBe(OrderStatus.PLACED);
    });

    test('should cancel order', async ({ shopDriver, erpApiDriver }) => {
        // Arrange
        const sku = `XYZ-${crypto.randomUUID()}`;
        const createProductResult = await erpApiDriver.createProduct(sku, '50.00');
        ResultAssert.assertSuccess(createProductResult);

        const placeOrderResult = await shopDriver.placeOrder(sku, '2', 'US');
        ResultAssert.assertSuccess(placeOrderResult);
        const orderNumber = placeOrderResult.getValue().orderNumber;

        // Act
        const cancelOrderResult = await shopDriver.cancelOrder(orderNumber);

        // Assert
        ResultAssert.assertSuccess(cancelOrderResult);

        // Verify order status is CANCELLED
        const viewOrderResult = await shopDriver.viewOrder(orderNumber);
        ResultAssert.assertSuccess(viewOrderResult);
        const orderDetails = viewOrderResult.getValue();

        expect(orderDetails.orderNumber).toBe(orderNumber);
        expect(orderDetails.sku).toBe(sku);
        expect(orderDetails.quantity).toBe(2);
        expect(orderDetails.country).toBe('US');
        expect(orderDetails.unitPrice).toBe(50.00);
        expect(orderDetails.originalPrice).toBe(100.00);
        expect(orderDetails.status).toBe(OrderStatus.CANCELLED);
    });

    test('should reject order with null quantity', async ({ shopDriver }) => {
        const result = await shopDriver.placeOrder('some-sku', null as any, 'US');
        ResultAssert.assertFailureWithMessage(result, 'Quantity must not be empty');
    });

    test('should reject order with null SKU', async ({ shopDriver }) => {
        const result = await shopDriver.placeOrder(null as any, '5', 'US');
        ResultAssert.assertFailureWithMessage(result, 'SKU must not be empty');
    });

    test('should reject order with null country', async ({ shopDriver }) => {
        const result = await shopDriver.placeOrder('some-sku', '5', null as any);
        ResultAssert.assertFailureWithMessage(result, 'Country must not be empty');
    });

    test('should not cancel non-existent order', async ({ shopDriver }) => {
        const result = await shopDriver.cancelOrder('NON-EXISTENT-ORDER-99999');
        ResultAssert.assertFailureWithMessage(result, 'Order NON-EXISTENT-ORDER-99999 does not exist.');
    });

    test('should not cancel already cancelled order', async ({ shopDriver, erpApiDriver }) => {
        // Arrange
        const sku = `MNO-${crypto.randomUUID()}`;
        const createProductResult = await erpApiDriver.createProduct(sku, '35.00');
        ResultAssert.assertSuccess(createProductResult);

        const placeOrderResult = await shopDriver.placeOrder(sku, '3', 'US');
        ResultAssert.assertSuccess(placeOrderResult);
        const orderNumber = placeOrderResult.getValue().orderNumber;

        // Cancel the order first time - should succeed
        const cancelResult = await shopDriver.cancelOrder(orderNumber);
        ResultAssert.assertSuccess(cancelResult);

        // Try to cancel the same order again - should fail
        const secondCancelResult = await shopDriver.cancelOrder(orderNumber);
        ResultAssert.assertFailureWithMessage(secondCancelResult, 'Order has already been cancelled');
    });
}

export { expect };
