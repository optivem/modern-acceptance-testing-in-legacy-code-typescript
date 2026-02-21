/**
 * V6 e2e: view order positive (matches reference ViewOrderPositiveTest).
 */
import '../../../setup-config.js';
import { Channel } from './base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';
import { GherkinDefaults } from '../../../../dsl/gherkin/GherkinDefaults.js';

Channel(ChannelType.UI, ChannelType.API)('should view placed order', async ({ scenario }) => {
    await scenario
        .given().product()
            .withSku(GherkinDefaults.DEFAULT_SKU)
            .withUnitPrice(25.0)
        .and().order()
            .withOrderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .withSku(GherkinDefaults.DEFAULT_SKU)
            .withCountry(GherkinDefaults.DEFAULT_COUNTRY)
            .withQuantity(4)
        .when().viewOrder()
            .withOrderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .then().shouldSucceed()
        .and().order(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .hasSku(GherkinDefaults.DEFAULT_SKU)
            .hasQuantity(4)
            .hasCountry(GherkinDefaults.DEFAULT_COUNTRY)
            .hasUnitPrice(25.0)
            .hasSubtotalPrice(100.0)
            .hasStatus(OrderStatus.PLACED)
            .hasDiscountRateGreaterThanOrEqualToZero()
            .hasDiscountAmountGreaterThanOrEqualToZero()
            .hasSubtotalPriceGreaterThanZero()
            .hasTaxRateGreaterThanOrEqualToZero()
            .hasTaxAmountGreaterThanOrEqualToZero()
            .hasTotalPriceGreaterThanZero();
});
