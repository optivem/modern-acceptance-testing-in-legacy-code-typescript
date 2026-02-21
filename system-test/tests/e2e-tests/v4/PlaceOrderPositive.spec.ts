import '../../../setup-config.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import { channelShopDriverTest, createUniqueSku, expect } from './base/fixtures.js';

function asNumber(value: unknown): number {
    if (typeof value === 'number') {
        return value;
    }
    if (value != null && typeof (value as { toNumber?: () => number }).toNumber === 'function') {
        return (value as { toNumber: () => number }).toNumber();
    }
    return Number(value);
}

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should place order with correct subtotal price', async ({ shopDriver, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

    const placeOrderResult = await shopDriver.orders().placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult).toBeSuccess();

    const orderNumber = placeOrderResult.getValue().orderNumber;
    const viewOrderResult = await shopDriver.orders().viewOrder(orderNumber);
    expect(viewOrderResult).toBeSuccess();
    expect(asNumber(viewOrderResult.getValue().subtotalPrice)).toBe(100.0);
});

const subtotalPriceCases = [
    { unitPrice: '20.00', quantity: '5', subtotalPrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', subtotalPrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', subtotalPrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', subtotalPrice: '99.99' },
];

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should place order with correct subtotal price parameterized', async ({ shopDriver, erpDriver }) => {
    for (const { unitPrice, quantity, subtotalPrice } of subtotalPriceCases) {
        const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
        expect(await erpDriver.returnsProduct({ sku, price: unitPrice })).toBeSuccess();

        const placeOrderResult = await shopDriver.orders().placeOrder({ sku, quantity, country: GherkinDefaults.DEFAULT_COUNTRY });
        expect(placeOrderResult).toBeSuccess();

        const orderNumber = placeOrderResult.getValue().orderNumber;
        const viewOrderResult = await shopDriver.orders().viewOrder(orderNumber);
        expect(viewOrderResult).toBeSuccess();
        expect(asNumber(viewOrderResult.getValue().subtotalPrice)).toBe(parseFloat(subtotalPrice));
    }
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should place order', async ({ shopDriver, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

    const placeOrderResult = await shopDriver.orders().placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult).toBeSuccess();

    const orderNumber = placeOrderResult.getValue().orderNumber;
    expect(orderNumber.startsWith('ORD-')).toBe(true);

    const viewOrderResult = await shopDriver.orders().viewOrder(orderNumber);
    expect(viewOrderResult).toBeSuccess();

    const order = viewOrderResult.getValue();
    expect(order.orderNumber).toBe(orderNumber);
    expect(order.sku).toBe(sku);
    expect(order.country).toBe(GherkinDefaults.DEFAULT_COUNTRY);
    expect(asNumber(order.quantity)).toBe(5);
    expect(asNumber(order.unitPrice)).toBe(20.0);
    expect(asNumber(order.subtotalPrice)).toBe(100.0);
    expect(order.status).toBe(OrderStatus.PLACED);
    expect(asNumber(order.discountRate)).toBeGreaterThanOrEqual(0);
    expect(asNumber(order.discountAmount)).toBeGreaterThanOrEqual(0);
    expect(asNumber(order.subtotalPrice)).toBeGreaterThan(0);
    expect(asNumber(order.taxRate)).toBeGreaterThanOrEqual(0);
    expect(asNumber(order.taxAmount)).toBeGreaterThanOrEqual(0);
    expect(asNumber(order.totalPrice)).toBeGreaterThan(0);
});
