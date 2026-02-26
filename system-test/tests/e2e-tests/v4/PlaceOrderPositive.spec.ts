import '../../../setup-config.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-api/shop/dtos/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { channelShopDriverTest, createUniqueSku, expect } from './base/fixtures.js';

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should place order with correct subtotal price', async ({ shopDriver, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

    const placeOrderResult = await shopDriver.placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult).toBeSuccess();

    const orderNumber = placeOrderResult.getValue().orderNumber;
    const viewOrderResult = await shopDriver.viewOrder(orderNumber);
    expect(viewOrderResult).toBeSuccess();
    expect(viewOrderResult.getValue().subtotalPrice).toEqualDecimal(100.0);
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

        const placeOrderResult = await shopDriver.placeOrder({ sku, quantity, country: GherkinDefaults.DEFAULT_COUNTRY });
        expect(placeOrderResult).toBeSuccess();

        const orderNumber = placeOrderResult.getValue().orderNumber;
        const viewOrderResult = await shopDriver.viewOrder(orderNumber);
        expect(viewOrderResult).toBeSuccess();
        expect(viewOrderResult.getValue().subtotalPrice).toEqualDecimal(subtotalPrice);
    }
});

channelShopDriverTest([ChannelType.UI, ChannelType.API], 'should place order', async ({ shopDriver, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

    const placeOrderResult = await shopDriver.placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult).toBeSuccess();

    const orderNumber = placeOrderResult.getValue().orderNumber;
    expect(orderNumber.startsWith('ORD-')).toBe(true);

    const viewOrderResult = await shopDriver.viewOrder(orderNumber);
    expect(viewOrderResult).toBeSuccess();

    const order = viewOrderResult.getValue();
    expect(order.orderNumber).toBe(orderNumber);
    expect(order.sku).toBe(sku);
    expect(order.country).toBe(GherkinDefaults.DEFAULT_COUNTRY);
    expect(order.quantity).toEqualInteger(5);
    expect(order.unitPrice).toEqualDecimal(20.0);
    expect(order.subtotalPrice).toEqualDecimal(100.0);
    expect(order.status).toBe(OrderStatus.PLACED);
    expect(order.discountRate).toBeGreaterThanOrEqualDecimal(0);
    expect(order.discountAmount).toBeGreaterThanOrEqualDecimal(0);
    expect(order.subtotalPrice).toBeGreaterThanDecimal(0);
    expect(order.taxRate).toBeGreaterThanOrEqualDecimal(0);
    expect(order.taxAmount).toBeGreaterThanOrEqualDecimal(0);
    expect(order.totalPrice).toBeGreaterThanDecimal(0);
});


