import { describe, test } from '@jest/globals';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';
import { ErpApiDriver } from '../../core/drivers/external/erp/api/ErpApiDriver.js';
import { ResultAssert } from '../../core/drivers/commons/ResultAssert.js';

export function defineApiE2eTests(
    getShopDriver: () => ShopDriver,
    getErpApiDriver: () => ErpApiDriver
) {
    describe('API E2E Tests', () => {
        test('should reject order with null quantity', async () => {
            const shopDriver = getShopDriver();
            const result = await shopDriver.placeOrder('some-sku', null as any, 'US');
            ResultAssert.assertFailureWithMessage(result, 'Quantity must not be empty');
        });

        test('should reject order with null SKU', async () => {
            const shopDriver = getShopDriver();
            const result = await shopDriver.placeOrder(null as any, '5', 'US');
            ResultAssert.assertFailureWithMessage(result, 'SKU must not be empty');
        });

        test('should reject order with null country', async () => {
            const shopDriver = getShopDriver();
            const result = await shopDriver.placeOrder('some-sku', '5', null as any);
            ResultAssert.assertFailureWithMessage(result, 'Country must not be empty');
        });

        test('should not cancel non-existent order', async () => {
            const shopDriver = getShopDriver();
            const result = await shopDriver.cancelOrder('NON-EXISTENT-ORDER-99999');
            ResultAssert.assertFailureWithMessage(result, 'Order NON-EXISTENT-ORDER-99999 does not exist.');
        });

        test('should not cancel already cancelled order', async () => {
            const shopDriver = getShopDriver();
            const erpApiDriver = getErpApiDriver();
            
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
