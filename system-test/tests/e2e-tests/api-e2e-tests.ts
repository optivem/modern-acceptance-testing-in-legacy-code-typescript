import { TestFixtures } from '../fixtures.js';
import { ResultAssert } from '../../core/drivers/commons/ResultAssert.js';

export function defineApiE2eTests(test: any) {
    test.describe('API E2E Tests', () => {
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
