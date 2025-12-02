import { TestFixtures } from '../fixtures.js';
import { expect } from '@playwright/test';

export function defineApiE2eTests(test: any) {
    test.describe('API E2E Tests', () => {
        test('should reject order with null quantity', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.placeOrder('some-sku', null as any, 'US');
            await expect(result).toBeFailureWith('Quantity must not be empty');
        });

        test('should reject order with null SKU', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.placeOrder(null as any, '5', 'US');
            await expect(result).toBeFailureWith('SKU must not be empty');
        });

        test('should reject order with null country', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.placeOrder('some-sku', '5', null as any);
            await expect(result).toBeFailureWith('Country must not be empty');
        });

        test('should not cancel non-existent order', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.cancelOrder('NON-EXISTENT-ORDER-99999');
            await expect(result).toBeFailureWith('Order NON-EXISTENT-ORDER-99999 does not exist.');
        });

        test('should not cancel already cancelled order', async ({ shopDriver, erpApiDriver }: TestFixtures) => {
            const sku = `MNO-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '35.00');
            await expect(createProductResult).toBeSuccess();

            const placeOrderResult = await shopDriver.placeOrder(sku, '3', 'US');
            await expect(placeOrderResult).toBeSuccess();
            const orderNumber = placeOrderResult.getValue().orderNumber;

            const cancelResult = await shopDriver.cancelOrder(orderNumber);
            await expect(cancelResult).toBeSuccess();

            const secondCancelResult = await shopDriver.cancelOrder(orderNumber);
            await expect(secondCancelResult).toBeFailureWith('Order has already been cancelled');
        });
    });
}
