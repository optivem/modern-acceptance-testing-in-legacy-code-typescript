import { test as base } from '../fixtures.js';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { TestFixtures } from '../fixtures.js';
import { expect } from '@playwright/test';
import { OrderStatus } from '../../core/drivers/system/commons/enums/OrderStatus.js';
import { Closer } from '../../core/drivers/commons/clients/Closer.js';
import { setupResultMatchers } from '../../core/matchers/resultMatchers.js';

setupResultMatchers();

export const test = base.extend({
    erpApiDriver: async ({}, use: any) => {
        const driver = DriverFactory.createErpApiDriver();
        await use(driver);
        await Closer.close(driver);
    },

    taxApiDriver: async ({}, use: any) => {
        const driver = DriverFactory.createTaxApiDriver();
        await use(driver);
        await Closer.close(driver);
    },
});

export { expect } from '@playwright/test';

export function defineE2eTests(test: any) {
    test.describe('E2E Tests', () => {
        test('should place order and calculate original price', async ({ shopDriver, erpApiDriver }: TestFixtures) => {
            const sku = `ABC-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '20.00');
            await expect(createProductResult).toBeSuccess();

            const placeOrderResult = await shopDriver.placeOrder(sku, '5', 'US');
            await expect(placeOrderResult).toBeSuccess();
            const orderNumber = placeOrderResult.getValue().orderNumber;
            expect(orderNumber).toBeTruthy();
            expect(orderNumber).toMatch(/^ORD-/);

            const viewOrderResult = await shopDriver.viewOrder(orderNumber);
            await expect(viewOrderResult).toBeSuccess();
            const orderDetails = viewOrderResult.getValue();

            expect(orderDetails.orderNumber).toBe(orderNumber);
            expect(orderDetails.sku).toBe(sku);
            expect(orderDetails.quantity).toBe(5);
            expect(orderDetails.country).toBe('US');
            expect(orderDetails.unitPrice).toBe(20.00);
            expect(orderDetails.originalPrice).toBe(100.00);
            expect(orderDetails.status).toBe(OrderStatus.PLACED);
            
            // Validate discount fields are non-negative
            expect(orderDetails.discountRate).toBeGreaterThanOrEqual(0);
            expect(orderDetails.discountAmount).toBeGreaterThanOrEqual(0);
            expect(orderDetails.subtotalPrice).toBeGreaterThan(0);
            
            // Validate tax fields are non-negative
            expect(orderDetails.taxRate).toBeGreaterThanOrEqual(0);
            expect(orderDetails.taxAmount).toBeGreaterThanOrEqual(0);
            expect(orderDetails.totalPrice).toBeGreaterThan(0);
        });

        test('should cancel order', async ({ shopDriver, erpApiDriver }: TestFixtures) => {
            const sku = `XYZ-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '50.00');
            await expect(createProductResult).toBeSuccess();

            const placeOrderResult = await shopDriver.placeOrder(sku, '2', 'US');
            await expect(placeOrderResult).toBeSuccess();
            const orderNumber = placeOrderResult.getValue().orderNumber;

            const cancelOrderResult = await shopDriver.cancelOrder(orderNumber);
            await expect(cancelOrderResult).toBeSuccess();

            const viewOrderResult = await shopDriver.viewOrder(orderNumber);
            await expect(viewOrderResult).toBeSuccess();
            const orderDetails = viewOrderResult.getValue();

            expect(orderDetails.orderNumber).toBe(orderNumber);
            expect(orderDetails.sku).toBe(sku);
            expect(orderDetails.quantity).toBe(2);
            expect(orderDetails.country).toBe('US');
            expect(orderDetails.unitPrice).toBe(50.00);
            expect(orderDetails.originalPrice).toBe(100.00);
            expect(orderDetails.status).toBe(OrderStatus.CANCELLED);
        });

        test('should reject order with non-existent SKU', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.placeOrder('NON-EXISTENT-SKU-12345', '5', 'US');
            await expect(result).toBeFailureWith('Product does not exist for SKU: NON-EXISTENT-SKU-12345');
        });

        test('should not be able to view non-existent order', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.viewOrder('NON-EXISTENT-ORDER-12345');
            await expect(result).toBeFailureWith('Order NON-EXISTENT-ORDER-12345 does not exist.');
        });

        test('should reject order with negative quantity', async ({ shopDriver, erpApiDriver }: TestFixtures) => {
            const sku = `DEF-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '30.00');
            await expect(createProductResult).toBeSuccess();

            const result = await shopDriver.placeOrder(sku, '-3', 'US');
            await expect(result).toBeFailureWith('Quantity must be positive');
        });

        test('should reject order with zero quantity', async ({ shopDriver, erpApiDriver }: TestFixtures) => {
            const sku = `GHI-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '40.00');
            await expect(createProductResult).toBeSuccess();

            const result = await shopDriver.placeOrder(sku, '0', 'US');
            await expect(result).toBeFailureWith('Quantity must be positive');
        });

        test.describe('should reject order with empty SKU', () => {
            const emptySKUs = ['', '   '];
            
            for (const emptySku of emptySKUs) {
                test(`with value "${emptySku}"`, async ({ shopDriver }: TestFixtures) => {
                    const result = await shopDriver.placeOrder(emptySku, '5', 'US');
                    await expect(result).toBeFailureWith('SKU must not be empty');
                });
            }
        });

        test.describe('should reject order with non-integer quantity', () => {
            const nonIntegerQuantities = ['5.5', 'abc'];
            
            for (const nonIntegerQuantity of nonIntegerQuantities) {
                test(`with value "${nonIntegerQuantity}"`, async ({ shopDriver }: TestFixtures) => {
                    const result = await shopDriver.placeOrder('some-sku', nonIntegerQuantity, 'US');
                    await expect(result).toBeFailureWith('Quantity must be an integer');
                });
            }
        });

        test.describe('should reject order with empty country', () => {
            const emptyCountries = ['', '   '];
            
            for (const emptyCountry of emptyCountries) {
                test(`with value "${emptyCountry}"`, async ({ shopDriver }: TestFixtures) => {
                    const result = await shopDriver.placeOrder('some-sku', '5', emptyCountry);
                    await expect(result).toBeFailureWith('Country must not be empty');
                });
            }
        });

        test('should reject order with unsupported country', async ({ shopDriver, erpApiDriver }: TestFixtures) => {
            const sku = `JKL-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '25.00');
            await expect(createProductResult).toBeSuccess();

            const result = await shopDriver.placeOrder(sku, '3', 'XX');
            await expect(result).toBeFailureWith('Country does not exist: XX');
        });
    });
}
