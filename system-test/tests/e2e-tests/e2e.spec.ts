import '../../setup-config.js';
import { expect } from '@playwright/test';
import { setupResultMatchers } from '@optivem/commons/util';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { shopChannelTest as channelTest } from '@optivem/test-infrastructure';
import { OrderStatus } from '@optivem/core/shop/driver/dtos/enums/OrderStatus.js';
import { getExternalSystemMode } from '../../test.config.js';

setupResultMatchers();

channelTest(getExternalSystemMode(), [ChannelType.UI, ChannelType.API], 'should place order and calculate original price', async ({ shopDriver, erpApiDriver }) => {
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
    expect(orderDetails.subtotalPrice).toBe(100.00);
    expect(orderDetails.status).toBe(OrderStatus.PLACED);
    
    // Validate discount fields are non-negative
    expect(orderDetails.discountRate).toBeGreaterThanOrEqual(0);
    expect(orderDetails.discountAmount).toBeGreaterThanOrEqual(0);
    expect(orderDetails.preTaxTotal).toBeGreaterThan(0);
    
    // Validate tax fields are non-negative
    expect(orderDetails.taxRate).toBeGreaterThanOrEqual(0);
    expect(orderDetails.taxAmount).toBeGreaterThanOrEqual(0);
    expect(orderDetails.totalPrice).toBeGreaterThan(0);
});

channelTest(getExternalSystemMode(), [ChannelType.UI, ChannelType.API], 'should cancel order', async ({ shopDriver, erpApiDriver }) => {
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
    expect(orderDetails.subtotalPrice).toBe(100.00);
    expect(orderDetails.status).toBe(OrderStatus.CANCELLED);
});

channelTest(getExternalSystemMode(), [ChannelType.UI, ChannelType.API], 'should reject order with non-existent SKU', async ({ shopDriver }) => {
    const result = await shopDriver.placeOrder('NON-EXISTENT-SKU-12345', '5', 'US');
    expect(result).toHaveErrorMessage('The request contains one or more validation errors');
    expect(result).toHaveFieldError('Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

channelTest(getExternalSystemMode(), [ChannelType.UI, ChannelType.API], 'should not be able to view non-existent order', async ({ shopDriver }) => {
    const result = await shopDriver.viewOrder('NON-EXISTENT-ORDER-12345');
    expect(result).toBeFailureWith('Order NON-EXISTENT-ORDER-12345 does not exist.');
});

channelTest(getExternalSystemMode(), [ChannelType.UI, ChannelType.API], 'should reject order with negative quantity', async ({ shopDriver, erpApiDriver }) => {
    const sku = `DEF-${crypto.randomUUID()}`;
    const createProductResult = await erpApiDriver.createProduct(sku, '30.00');
    expect(createProductResult).toBeSuccess();

    const result = await shopDriver.placeOrder(sku, '-3', 'US');
    expect(result).toHaveErrorMessage('The request contains one or more validation errors');
    expect(result).toHaveFieldError('Quantity must be positive');
});

channelTest(getExternalSystemMode(), [ChannelType.UI, ChannelType.API], 'should reject order with zero quantity', async ({ shopDriver, erpApiDriver }) => {
    const sku = `GHI-${crypto.randomUUID()}`;
    const createProductResult = await erpApiDriver.createProduct(sku, '40.00');
    expect(createProductResult).toBeSuccess();

    const result = await shopDriver.placeOrder(sku, '0', 'US');
    expect(result).toHaveErrorMessage('The request contains one or more validation errors');
    expect(result).toHaveFieldError('Quantity must be positive');
});



channelTest(
    getExternalSystemMode(),
    [ChannelType.UI, ChannelType.API],
    [
        { sku: '', expectedMessage: 'SKU must not be empty' },
        { sku: '   ', expectedMessage: 'SKU must not be empty' }
    ],
    'should reject order with empty SKU',
    async ({ shopDriver }, data) => {
        const result = await shopDriver.placeOrder(data.sku, '5', 'US');
        expect(result).toHaveErrorMessage('The request contains one or more validation errors');
        expect(result).toHaveFieldError(data.expectedMessage);
    }
);

channelTest(
    getExternalSystemMode(),
    [ChannelType.UI, ChannelType.API],
    [
        { quantity: '5.5', expectedMessage: 'Quantity must be an integer' },
        { quantity: 'abc', expectedMessage: 'Quantity must be an integer' }
    ],
    'should reject order with non-integer quantity',
    async ({ shopDriver }, data) => {
        const result = await shopDriver.placeOrder('SKU-123', data.quantity, 'US');
        expect(result).toHaveErrorMessage('The request contains one or more validation errors');
        expect(result).toHaveFieldError(data.expectedMessage);
    }
);

channelTest(
    getExternalSystemMode(),
    [ChannelType.UI, ChannelType.API],
    [
        { country: '', expectedMessage: 'Country must not be empty' },
        { country: '   ', expectedMessage: 'Country must not be empty' }
    ],
    'should reject order with empty country',
    async ({ shopDriver }, data) => {
        const result = await shopDriver.placeOrder('SKU-123', '5', data.country);
        expect(result).toHaveErrorMessage('The request contains one or more validation errors');
        expect(result).toHaveFieldError(data.expectedMessage);
    }
);

channelTest(getExternalSystemMode(), [ChannelType.UI, ChannelType.API], 'should reject order with unsupported country', async ({ shopDriver, erpApiDriver }) => {
    const sku = `JKL-${crypto.randomUUID()}`;
    const createProductResult = await erpApiDriver.createProduct(sku, '25.00');
    expect(createProductResult).toBeSuccess();

    const result = await shopDriver.placeOrder(sku, '3', 'XX');
    expect(result).toHaveErrorMessage('The request contains one or more validation errors');
    expect(result).toHaveFieldError('Country does not exist: XX');
});

channelTest(getExternalSystemMode(), [ChannelType.API], 'should reject order with null quantity', async ({ shopDriver }) => {
    const result = await shopDriver.placeOrder('some-sku', null as any, 'US');
    expect(result).toHaveErrorMessage('The request contains one or more validation errors');
    expect(result).toHaveFieldError('Quantity must not be empty');
});

channelTest(getExternalSystemMode(), [ChannelType.API], 'should reject order with null SKU', async ({ shopDriver }) => {
    const result = await shopDriver.placeOrder(null as any, '5', 'US');
    expect(result).toHaveErrorMessage('The request contains one or more validation errors');
    expect(result).toHaveFieldError('SKU must not be empty');
});

channelTest(getExternalSystemMode(), [ChannelType.API], 'should reject order with null country', async ({ shopDriver }) => {
    const result = await shopDriver.placeOrder('some-sku', '5', null as any);
    expect(result).toHaveErrorMessage('The request contains one or more validation errors');
    expect(result).toHaveFieldError('Country must not be empty');
});

channelTest(
    getExternalSystemMode(),
    [ChannelType.API],
    [
        { orderNumber: 'NON-EXISTENT-ORDER-99999', expectedMessage: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
        { orderNumber: 'INVALID-ORDER-123', expectedMessage: 'Order INVALID-ORDER-123 does not exist.' }
    ],
    'should not cancel non-existent order',
    async ({ shopDriver }, data) => {
        const result = await shopDriver.cancelOrder(data.orderNumber);
        expect(result).toBeFailureWith(data.expectedMessage);
    }
);

channelTest(getExternalSystemMode(), [ChannelType.API], 'should not cancel already cancelled order', async ({ shopDriver, erpApiDriver }) => {
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


