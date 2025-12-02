import { describe, test, expect } from '@jest/globals';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';
import { ErpApiDriver } from '../../core/drivers/external/erp/api/ErpApiDriver.js';
import { TaxApiDriver } from '../../core/drivers/external/tax/api/TaxApiDriver.js';
import { OrderStatus } from '../../core/drivers/system/commons/enums/OrderStatus.js';
import { ResultAssert } from '../../core/drivers/commons/ResultAssert.js';

export function defineE2eTests(
    getShopDriver: () => ShopDriver,
    getErpApiDriver: () => ErpApiDriver,
    getTaxApiDriver: () => TaxApiDriver
) {
    describe('E2E Tests', () => {
        test('should place order and calculate original price', async () => {
            const shopDriver = getShopDriver();
            const erpApiDriver = getErpApiDriver();
            
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
            
            // Validate discount fields are non-negative
            expect(orderDetails.discountRate).toBeGreaterThanOrEqual(0);
            expect(orderDetails.discountAmount).toBeGreaterThanOrEqual(0);
            expect(orderDetails.subtotalPrice).toBeGreaterThan(0);
            
            // Validate tax fields are non-negative
            expect(orderDetails.taxRate).toBeGreaterThanOrEqual(0);
            expect(orderDetails.taxAmount).toBeGreaterThanOrEqual(0);
            expect(orderDetails.totalPrice).toBeGreaterThan(0);
        });


        test('should cancel order', async () => {
            const shopDriver = getShopDriver();
            const erpApiDriver = getErpApiDriver();
            
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

        test('should reject order with non-existent SKU', async () => {
            const shopDriver = getShopDriver();
            const result = await shopDriver.placeOrder('NON-EXISTENT-SKU-12345', '5', 'US');
            ResultAssert.assertFailureWithMessage(result, 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
        });

        test('should not be able to view non-existent order', async () => {
            const shopDriver = getShopDriver();
            const result = await shopDriver.viewOrder('NON-EXISTENT-ORDER-12345');
            ResultAssert.assertFailureWithMessage(result, 'Order NON-EXISTENT-ORDER-12345 does not exist.');
        });

        test('should reject order with negative quantity', async () => {
            const shopDriver = getShopDriver();
            const erpApiDriver = getErpApiDriver();
            
            const sku = `DEF-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '30.00');
            ResultAssert.assertSuccess(createProductResult);

            const result = await shopDriver.placeOrder(sku, '-3', 'US');
            ResultAssert.assertFailureWithMessage(result, 'Quantity must be positive');
        });

        test('should reject order with zero quantity', async () => {
            const shopDriver = getShopDriver();
            const erpApiDriver = getErpApiDriver();
            
            const sku = `GHI-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '40.00');
            ResultAssert.assertSuccess(createProductResult);

            const result = await shopDriver.placeOrder(sku, '0', 'US');
            ResultAssert.assertFailureWithMessage(result, 'Quantity must be positive');
        });

        describe('should reject order with empty SKU', () => {
            const emptySKUs = ['', '   '];
            
            for (const emptySku of emptySKUs) {
                test(`with value "${emptySku}"`, async () => {
                    const shopDriver = getShopDriver();
                    const result = await shopDriver.placeOrder(emptySku, '5', 'US');
                    ResultAssert.assertFailureWithMessage(result, 'SKU must not be empty');
                });
            }
        });

        describe('should reject order with non-integer quantity', () => {
            const nonIntegerQuantities = ['5.5', 'abc'];
            
            for (const nonIntegerQuantity of nonIntegerQuantities) {
                test(`with value "${nonIntegerQuantity}"`, async () => {
                    const shopDriver = getShopDriver();
                    const result = await shopDriver.placeOrder('some-sku', nonIntegerQuantity, 'US');
                    ResultAssert.assertFailureWithMessage(result, 'Quantity must be an integer');
                });
            }
        });

        describe('should reject order with empty country', () => {
            const emptyCountries = ['', '   '];
            
            for (const emptyCountry of emptyCountries) {
                test(`with value "${emptyCountry}"`, async () => {
                    const shopDriver = getShopDriver();
                    const result = await shopDriver.placeOrder('some-sku', '5', emptyCountry);
                    ResultAssert.assertFailureWithMessage(result, 'Country must not be empty');
                });
            }
        });

        test('should reject order with unsupported country', async () => {
            const shopDriver = getShopDriver();
            const erpApiDriver = getErpApiDriver();
            
            const sku = `JKL-${crypto.randomUUID()}`;
            const createProductResult = await erpApiDriver.createProduct(sku, '25.00');
            ResultAssert.assertSuccess(createProductResult);

            const result = await shopDriver.placeOrder(sku, '3', 'XX');
            ResultAssert.assertFailureWithMessage(result, 'Country does not exist: XX');
        });
    });
}
