import '../../../setup-config.js';
import { Channel } from './base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';

Channel(ChannelType.UI, ChannelType.API)('should view placed order', async ({ app }) => {
    (await app.erp().returnsProduct()
        .sku(GherkinDefaults.DEFAULT_SKU)
        .unitPrice(25.0)
        .execute())
        .shouldSucceed();

    (await app.shop().placeOrder()
        .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .sku(GherkinDefaults.DEFAULT_SKU)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .quantity(4)
        .execute())
        .shouldSucceed();

    (await app.shop().viewOrder()
        .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .execute())
        .shouldSucceed()
        .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .sku(GherkinDefaults.DEFAULT_SKU)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .quantity(4)
        .unitPrice(25.0)
        .subtotalPrice(100.0)
        .status(OrderStatus.PLACED)
        .discountRateGreaterThanOrEqualToZero()
        .discountAmountGreaterThanOrEqualToZero()
        .subtotalPriceGreaterThanZero()
        .taxRateGreaterThanOrEqualToZero()
        .taxAmountGreaterThanOrEqualToZero()
        .totalPriceGreaterThanZero();
});
