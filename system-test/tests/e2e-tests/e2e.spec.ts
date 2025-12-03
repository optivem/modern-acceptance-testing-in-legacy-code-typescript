import { expect } from '@playwright/test';
import { setupResultMatchers } from '../../core/matchers/resultMatchers.js';
import { ChannelType, channelTest } from '../../core/channels/index.js';
import { OrderStatus } from '../../core/drivers/system/commons/enums/OrderStatus.js';

setupResultMatchers();

channelTest([ChannelType.UI, ChannelType.API], 'should place order and calculate original price', async ({ shopDriver, erpApiDriver }) => {
    const sku = `ABC-${crypto.randomUUID()}`;
    const createProductResult = await erpApiDriver.createProduct(sku, '20.00');
    expect(createProductResult).toBeSuccess();

    const placeOrderResult = await shopDriver.placeOrder(sku, '5', 'US');
    expect(placeOrderResult).toBeSuccess();
    const orderNumber = placeOrderResult.getValue().orderNumber;
    expect(orderNumber).toBeTruthy();
    expect(orderNumber).toMatch(/^ORD-/);

    const viewOrderResult = await shopDriver.viewOrder(orderNumber);
    expect(viewOrderResult).toBeSuccess();
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

channelTest([ChannelType.UI, ChannelType.API], 'should cancel order', async ({ shopDriver, erpApiDriver }) => {
    const sku = `XYZ-${crypto.randomUUID()}`;
    const createProductResult = await erpApiDriver.createProduct(sku, '50.00');
    expect(createProductResult).toBeSuccess();

    const placeOrderResult = await shopDriver.placeOrder(sku, '2', 'US');
    expect(placeOrderResult).toBeSuccess();
    const orderNumber = placeOrderResult.getValue().orderNumber;

    const cancelOrderResult = await shopDriver.cancelOrder(orderNumber);
    expect(cancelOrderResult).toBeSuccess();

    const viewOrderResult = await shopDriver.viewOrder(orderNumber);
    expect(viewOrderResult).toBeSuccess();
    const orderDetails = viewOrderResult.getValue();

    expect(orderDetails.orderNumber).toBe(orderNumber);
    expect(orderDetails.sku).toBe(sku);
    expect(orderDetails.quantity).toBe(2);
    expect(orderDetails.country).toBe('US');
    expect(orderDetails.unitPrice).toBe(50.00);
    expect(orderDetails.originalPrice).toBe(100.00);
    expect(orderDetails.status).toBe(OrderStatus.CANCELLED);
});

channelTest([ChannelType.UI, ChannelType.API], 'should reject order with non-existent SKU', async ({ shopDriver }) => {
    const result = await shopDriver.placeOrder('NON-EXISTENT-SKU-12345', '5', 'US');
    expect(result).toBeFailureWith('Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

channelTest([ChannelType.UI, ChannelType.API], 'should not be able to view non-existent order', async ({ shopDriver }) => {
    const result = await shopDriver.viewOrder('NON-EXISTENT-ORDER-12345');
    expect(result).toBeFailureWith('Order NON-EXISTENT-ORDER-12345 does not exist.');
});

channelTest([ChannelType.UI, ChannelType.API], 'should reject order with negative quantity', async ({ shopDriver, erpApiDriver }) => {
    const sku = `DEF-${crypto.randomUUID()}`;
    const createProductResult = await erpApiDriver.createProduct(sku, '30.00');
    expect(createProductResult).toBeSuccess();

    const result = await shopDriver.placeOrder(sku, '-3', 'US');
    expect(result).toBeFailureWith('Quantity must be positive');
});

channelTest([ChannelType.UI, ChannelType.API], 'should reject order with zero quantity', async ({ shopDriver, erpApiDriver }) => {
    const sku = `GHI-${crypto.randomUUID()}`;
    const createProductResult = await erpApiDriver.createProduct(sku, '40.00');
    expect(createProductResult).toBeSuccess();

    const result = await shopDriver.placeOrder(sku, '0', 'US');
    expect(result).toBeFailureWith('Quantity must be positive');
});



channelTest([ChannelType.UI, ChannelType.API], 'should reject order with empty SKU', async ({ shopDriver }) => {
    const emptySKUs = ['', '   '];
    
    for (const emptySku of emptySKUs) {
            const result = await shopDriver.placeOrder(emptySku, '5', 'US');
            expect(result).toBeFailureWith('SKU must not be empty');
    }
});

channelTest([ChannelType.UI, ChannelType.API], 'should reject order with non-integer quantity', async ({ shopDriver }) => {
    const nonIntegerQuantities = ['5.5', 'abc'];
    
    for (const nonIntegerQuantity of nonIntegerQuantities) {
        const result = await shopDriver.placeOrder('some-sku', nonIntegerQuantity, 'US');
        expect(result).toBeFailureWith('Quantity must be an integer');
    }
});

channelTest([ChannelType.UI, ChannelType.API], 'should reject order with empty country', async ({ shopDriver }) => {
    const emptyCountries = ['', '   '];
    
    for (const emptyCountry of emptyCountries) {
        const result = await shopDriver.placeOrder('some-sku', '5', emptyCountry);
        expect(result).toBeFailureWith('Country must not be empty');
    }
});

channelTest([ChannelType.UI, ChannelType.API], 'should reject order with unsupported country', async ({ shopDriver, erpApiDriver }) => {
    const sku = `JKL-${crypto.randomUUID()}`;
    const createProductResult = await erpApiDriver.createProduct(sku, '25.00');
    expect(createProductResult).toBeSuccess();

    const result = await shopDriver.placeOrder(sku, '3', 'XX');
    expect(result).toBeFailureWith('Country does not exist: XX');
});

channelTest([ChannelType.API], 'should reject order with null quantity', async ({ shopDriver }) => {
    const result = await shopDriver.placeOrder('some-sku', null as any, 'US');
    expect(result).toBeFailureWith('Quantity must not be empty');
});

channelTest([ChannelType.API], 'should reject order with null SKU', async ({ shopDriver }) => {
    const result = await shopDriver.placeOrder(null as any, '5', 'US');
    expect(result).toBeFailureWith('SKU must not be empty');
});

channelTest([ChannelType.API], 'should reject order with null country', async ({ shopDriver }) => {
    const result = await shopDriver.placeOrder('some-sku', '5', null as any);
    expect(result).toBeFailureWith('Country must not be empty');
});

channelTest([ChannelType.API], 'should not cancel non-existent order', async ({ shopDriver }) => {
    const result = await shopDriver.cancelOrder('NON-EXISTENT-ORDER-99999');
    expect(result).toBeFailureWith('Order NON-EXISTENT-ORDER-99999 does not exist.');
});

channelTest([ChannelType.API], 'should not cancel already cancelled order', async ({ shopDriver, erpApiDriver }) => {
    const sku = `MNO-${crypto.randomUUID()}`;
    const createProductResult = await erpApiDriver.createProduct(sku, '35.00');
    expect(createProductResult).toBeSuccess();

    const placeOrderResult = await shopDriver.placeOrder(sku, '3', 'US');
    expect(placeOrderResult).toBeSuccess();
    const orderNumber = placeOrderResult.getValue().orderNumber;

    const cancelResult = await shopDriver.cancelOrder(orderNumber);
    expect(cancelResult).toBeSuccess();

    const secondCancelResult = await shopDriver.cancelOrder(orderNumber);
    expect(secondCancelResult).toBeFailureWith('Order has already been cancelled');
});
