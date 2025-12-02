import { test as base } from '../fixtures.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { TestFixtures } from '../fixtures.js';
import { expect } from '@playwright/test';
import { OrderStatus } from '../../core/drivers/system/commons/enums/OrderStatus.js';
import { ResultAssert } from '../../core/drivers/commons/ResultAssert.js';

export const test = base.extend({
    erpApiDriver: async ({}, use: any) => {
        const driver = DriverFactory.createErpApiDriver();
        await use(driver);
        await driver.close();
    },

    taxApiDriver: async ({}, use: any) => {
        const driver = DriverFactory.createTaxApiDriver();
        await use(driver);
        await driver.close();
    },
});

export { expect } from '@playwright/test';

export function defineE2eTests(test: any) {
    test.describe('E2E Tests', () => {
        test('should place order and calculate original price', async ({ shopDriver, erpApiDriver }: TestFixtures) => {
            const sku = `ABC-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '20.00');
            ResultAssert.assertSuccess(createProductResult);

            const placeOrderResult = await shopDriver.placeOrder(sku, '5', 'US');
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

        test('should cancel order', async ({ shopDriver, erpApiDriver }: TestFixtures) => {
            const sku = `XYZ-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '50.00');
            ResultAssert.assertSuccess(createProductResult);

            const placeOrderResult = await shopDriver.placeOrder(sku, '2', 'US');
            ResultAssert.assertSuccess(placeOrderResult);
            const orderNumber = placeOrderResult.getValue().orderNumber;

            const cancelOrderResult = await shopDriver.cancelOrder(orderNumber);
            ResultAssert.assertSuccess(cancelOrderResult);

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

        test('should reject order with null quantity', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.placeOrder('some-sku', null as any, 'US');
            ResultAssert.assertFailureWithMessage(result, 'Quantity must not be empty');
        });

        test('should reject order with null SKU', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.placeOrder(null as any, '5', 'US');
            ResultAssert.assertFailureWithMessage(result, 'SKU must not be empty');
        });

        test('should reject order with null country', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.placeOrder('some-sku', '5', null as any);
            ResultAssert.assertFailureWithMessage(result, 'Country must not be empty');
        });

        test('should not cancel non-existent order', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.cancelOrder('NON-EXISTENT-ORDER-99999');
            ResultAssert.assertFailureWithMessage(result, 'Order NON-EXISTENT-ORDER-99999 does not exist.');
        });

        test('should not cancel already cancelled order', async ({ shopDriver, erpApiDriver }: TestFixtures) => {
            const sku = `MNO-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '35.00');
            ResultAssert.assertSuccess(createProductResult);

            const placeOrderResult = await shopDriver.placeOrder(sku, '3', 'US');
            ResultAssert.assertSuccess(placeOrderResult);
            const orderNumber = placeOrderResult.getValue().orderNumber;

            const cancelResult = await shopDriver.cancelOrder(orderNumber);
            ResultAssert.assertSuccess(cancelResult);

            const secondCancelResult = await shopDriver.cancelOrder(orderNumber);
            ResultAssert.assertFailureWithMessage(secondCancelResult, 'Order has already been cancelled');
        });
    });
}
