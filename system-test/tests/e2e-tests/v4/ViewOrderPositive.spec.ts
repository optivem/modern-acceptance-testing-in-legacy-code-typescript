/**
 * V4 e2e: view order positive (driver-level style).
 */
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

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should view placed order', async ({ shopDriver, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '25.00' })).toBeSuccess();

    const placeOrderResult = await shopDriver.orders().placeOrder({ sku, quantity: '4', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult).toBeSuccess();

    const orderNumber = placeOrderResult.getValue().orderNumber;
    const viewOrderResult = await shopDriver.orders().viewOrder(orderNumber);
    expect(viewOrderResult).toBeSuccess();

    const order = viewOrderResult.getValue();
    expect(order.orderNumber).toBe(orderNumber);
    expect(order.sku).toBe(sku);
    expect(order.country).toBe(GherkinDefaults.DEFAULT_COUNTRY);
    expect(asNumber(order.quantity)).toBe(4);
    expect(asNumber(order.unitPrice)).toBe(25.0);
    expect(asNumber(order.subtotalPrice)).toBe(100.0);
    expect(order.status).toBe(OrderStatus.PLACED);
    expect(asNumber(order.discountRate)).toBeGreaterThanOrEqual(0);
    expect(asNumber(order.discountAmount)).toBeGreaterThanOrEqual(0);
    expect(asNumber(order.subtotalPrice)).toBeGreaterThan(0);
    expect(asNumber(order.taxRate)).toBeGreaterThanOrEqual(0);
    expect(asNumber(order.taxAmount)).toBeGreaterThanOrEqual(0);
    expect(asNumber(order.totalPrice)).toBeGreaterThan(0);
});
