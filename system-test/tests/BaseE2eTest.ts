import { test as base, expect } from '@playwright/test';
import { ShopDriver } from '../core/drivers/system/ShopDriver.js';
import { ErpApiDriver } from '../core/drivers/external/erp/api/ErpApiDriver.js';
import { TaxApiDriver } from '../core/drivers/external/tax/api/TaxApiDriver.js';
import { DriverFactory } from '../core/drivers/DriverFactory.js';
import { OrderStatus } from '../core/drivers/system/commons/enums/OrderStatus.js';
import { ResultAssert } from '../core/drivers/commons/ResultAssert.js';

export abstract class BaseE2eTest {
    public shopDriver!: ShopDriver;
    public erpApiDriver!: ErpApiDriver;
    public taxApiDriver!: TaxApiDriver;

    protected abstract createDriver(): ShopDriver;

    async setUp() {
        this.shopDriver = this.createDriver();
        this.erpApiDriver = DriverFactory.createErpApiDriver();
        this.taxApiDriver = DriverFactory.createTaxApiDriver();
    }

    async tearDown() {
        if (this.shopDriver) {
            this.shopDriver.close();
        }
        if (this.erpApiDriver) {
            this.erpApiDriver.close();
        }
        if (this.taxApiDriver) {
            this.taxApiDriver.close();
        }
    }

    async shouldPlaceOrderAndCalculateOriginalPrice() {
        // Arrange
        const sku = `ABC-${crypto.randomUUID()}`;
        const createProductResult = await this.erpApiDriver.createProduct(sku, '20.00');
        ResultAssert.assertSuccess(createProductResult);

        // Act
        const placeOrderResult = await this.shopDriver.placeOrder(sku, '5', 'US');

        // Assert
        ResultAssert.assertSuccess(placeOrderResult);
        const orderNumber = placeOrderResult.getValue().orderNumber;
        expect(orderNumber).toBeTruthy();
        expect(orderNumber).toMatch(/^ORD-/);

        const viewOrderResult = await this.shopDriver.viewOrder(orderNumber);
        ResultAssert.assertSuccess(viewOrderResult);
        const orderDetails = viewOrderResult.getValue();

        expect(orderDetails.orderNumber).toBe(orderNumber);
        expect(orderDetails.sku).toBe(sku);
        expect(orderDetails.quantity).toBe(5);
        expect(orderDetails.country).toBe('US');
        expect(orderDetails.unitPrice).toBe(20.00);
        expect(orderDetails.originalPrice).toBe(100.00);
        expect(orderDetails.status).toBe(OrderStatus.PLACED);
    }

    async shouldCancelOrder() {
        // Arrange
        const sku = `XYZ-${crypto.randomUUID()}`;
        const createProductResult = await this.erpApiDriver.createProduct(sku, '50.00');
        ResultAssert.assertSuccess(createProductResult);

        const placeOrderResult = await this.shopDriver.placeOrder(sku, '2', 'US');
        ResultAssert.assertSuccess(placeOrderResult);
        const orderNumber = placeOrderResult.getValue().orderNumber;

        // Act
        const cancelOrderResult = await this.shopDriver.cancelOrder(orderNumber);

        // Assert
        ResultAssert.assertSuccess(cancelOrderResult);

        // Verify order status is CANCELLED
        const viewOrderResult = await this.shopDriver.viewOrder(orderNumber);
        ResultAssert.assertSuccess(viewOrderResult);
        const orderDetails = viewOrderResult.getValue();

        expect(orderDetails.orderNumber).toBe(orderNumber);
        expect(orderDetails.sku).toBe(sku);
        expect(orderDetails.quantity).toBe(2);
        expect(orderDetails.country).toBe('US');
        expect(orderDetails.unitPrice).toBe(50.00);
        expect(orderDetails.originalPrice).toBe(100.00);
        expect(orderDetails.status).toBe(OrderStatus.CANCELLED);
    }

    async shouldRejectOrderWithNullQuantity() {
        const result = await this.shopDriver.placeOrder('some-sku', null as any, 'US');
        ResultAssert.assertFailureWithMessage(result, 'Quantity must not be empty');
    }

    async shouldRejectOrderWithNullSku() {
        const result = await this.shopDriver.placeOrder(null as any, '5', 'US');
        ResultAssert.assertFailureWithMessage(result, 'SKU must not be empty');
    }

    async shouldRejectOrderWithNullCountry() {
        const result = await this.shopDriver.placeOrder('some-sku', '5', null as any);
        ResultAssert.assertFailureWithMessage(result, 'Country must not be empty');
    }

    async shouldNotCancelNonExistentOrder() {
        const result = await this.shopDriver.cancelOrder('NON-EXISTENT-ORDER-99999');
        ResultAssert.assertFailureWithMessage(result, 'Order NON-EXISTENT-ORDER-99999 does not exist.');
    }

    async shouldNotCancelAlreadyCancelledOrder() {
        // Arrange
        const sku = `MNO-${crypto.randomUUID()}`;
        const createProductResult = await this.erpApiDriver.createProduct(sku, '35.00');
        ResultAssert.assertSuccess(createProductResult);

        const placeOrderResult = await this.shopDriver.placeOrder(sku, '3', 'US');
        ResultAssert.assertSuccess(placeOrderResult);
        const orderNumber = placeOrderResult.getValue().orderNumber;

        // Cancel the order first time - should succeed
        const cancelResult = await this.shopDriver.cancelOrder(orderNumber);
        ResultAssert.assertSuccess(cancelResult);

        // Try to cancel the same order again - should fail
        const secondCancelResult = await this.shopDriver.cancelOrder(orderNumber);
        ResultAssert.assertFailureWithMessage(secondCancelResult, 'Order has already been cancelled');
    }
}
