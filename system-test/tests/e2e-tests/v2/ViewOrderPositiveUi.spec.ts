import '../../../setup-config.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';
import { placeOrderUsingUiClient, viewOrderUsingUiClient } from './base/shopUiClientOrderFlows.js';

function asNumber(value: unknown): number {
    if (typeof value === 'number') {
        return value;
    }
    if (value != null && typeof (value as { toNumber?: () => number }).toNumber === 'function') {
        return (value as { toNumber: () => number }).toNumber();
    }
    return Number(value);
}

test('should view placed order', async ({ shopUiClient, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '25.00' })).toBeSuccess();

    const placeOrderResult = await placeOrderUsingUiClient(shopUiClient, { sku, quantity: '4', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult).toBeSuccess();

    const orderNumber = placeOrderResult.getValue().orderNumber;
    const viewOrderResult = await viewOrderUsingUiClient(shopUiClient, orderNumber);
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