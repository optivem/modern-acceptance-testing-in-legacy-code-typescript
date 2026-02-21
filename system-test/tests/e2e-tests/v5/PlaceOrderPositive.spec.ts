/**
 * V5 e2e: place order positive (app/SystemDsl style).
 */
import '../../../setup-config.js';
import { Channel } from './base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';

Channel(ChannelType.UI, ChannelType.API)('should place order with correct subtotal price', async ({ app }) => {
    (await app.erp().returnsProduct()
        .sku(GherkinDefaults.DEFAULT_SKU)
        .unitPrice(20.0)
        .execute())
        .shouldSucceed();

    (await app.shop().placeOrder()
        .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .sku(GherkinDefaults.DEFAULT_SKU)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .quantity(5)
        .execute())
        .shouldSucceed();

    (await app.shop().viewOrder()
        .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .execute())
        .shouldSucceed()
        .subtotalPrice(100.0);
});

const subtotalPriceCases = [
    { unitPrice: '20.00', quantity: '5', subtotalPrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', subtotalPrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', subtotalPrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', subtotalPrice: '99.99' },
];

Channel(ChannelType.UI, ChannelType.API)('should place order with correct subtotal price parameterized', async ({ app }) => {
    for (const { unitPrice, quantity, subtotalPrice } of subtotalPriceCases) {
        (await app.erp().returnsProduct()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .unitPrice(unitPrice)
            .execute())
            .shouldSucceed();

        (await app.shop().placeOrder()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(quantity)
            .execute())
            .shouldSucceed();

        (await app.shop().viewOrder()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .execute())
            .shouldSucceed()
            .subtotalPrice(subtotalPrice);
    }
});

Channel(ChannelType.UI, ChannelType.API)('should place order', async ({ app }) => {
    (await app.erp().returnsProduct()
        .sku(GherkinDefaults.DEFAULT_SKU)
        .unitPrice(20.0)
        .execute())
        .shouldSucceed();

    (await app.shop().placeOrder()
        .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .sku(GherkinDefaults.DEFAULT_SKU)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .quantity(5)
        .execute())
        .shouldSucceed()
        .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .orderNumberStartsWith('ORD-');

    (await app.shop().viewOrder()
        .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .execute())
        .shouldSucceed()
        .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .sku(GherkinDefaults.DEFAULT_SKU)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .quantity(5)
        .unitPrice(20.0)
        .subtotalPrice(100.0)
        .status(OrderStatus.PLACED)
        .discountRateGreaterThanOrEqualToZero()
        .discountAmountGreaterThanOrEqualToZero()
        .subtotalPriceGreaterThanZero()
        .taxRateGreaterThanOrEqualToZero()
        .taxAmountGreaterThanOrEqualToZero()
        .totalPriceGreaterThanZero();
});
