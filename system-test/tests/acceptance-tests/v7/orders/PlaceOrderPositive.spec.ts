/**
 * V7 acceptance: place order (positive). Migrated from Java PlaceOrderPositiveTest.
 */
import '../../../../setup-config.js';
import { Channel } from '../fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { OrderStatus } from '@optivem/core/shop/commons/dtos/orders/OrderStatus.js';

Channel(ChannelType.UI, ChannelType.API)('should be able to place order for valid input', async ({ scenario }) => {
    const whenClause = await scenario
        .given()
        .product()
        .withSku('ABC')
        .withUnitPrice(20.0)
        .and()
        .country()
        .withCode('US')
        .withTaxRate(0.1)
        .when();
    await whenClause.placeOrder().withSku('ABC').withQuantity(5).withCountry('US').then().shouldSucceed();
});

Channel(ChannelType.UI, ChannelType.API)('order status should be placed after placing order', async ({ scenario }) => {
    const success = await scenario.when().placeOrder().then().shouldSucceed();
    const orderVerifier = await success.order();
    orderVerifier.hasStatus(OrderStatus.PLACED);
});

Channel(ChannelType.UI, ChannelType.API)('should calculate base price as product of unit price and quantity', async ({ scenario }) => {
    const whenClause = await scenario.given().product().withUnitPrice(20.0).when();
    const success = await whenClause.placeOrder().withQuantity(5).then().shouldSucceed();
    const orderVerifier = await success.order();
    orderVerifier.hasBasePrice(100.0);
});

const basePriceCases = [
    { unitPrice: '20.00', quantity: '5', basePrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', basePrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', basePrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', basePrice: '99.99' },
];

Channel(ChannelType.UI, ChannelType.API)('should place order with correct base price parameterized', async ({ scenario }) => {
    for (const { unitPrice, quantity, basePrice } of basePriceCases) {
        const whenClause = await scenario.given().product().withUnitPrice(unitPrice).when();
        const success = await whenClause.placeOrder().withQuantity(quantity).then().shouldSucceed();
        const orderVerifier = await success.order();
        orderVerifier.hasBasePrice(basePrice);
    }
});

Channel(ChannelType.UI, ChannelType.API)('order prefix should be ORD', async ({ scenario }) => {
    const success = await scenario.when().placeOrder().then().shouldSucceed();
    const orderVerifier = await success.order();
    orderVerifier.hasOrderNumberPrefix('ORD-');
});

Channel(ChannelType.UI, ChannelType.API)('discount rate should be applied for coupon', async ({ scenario }) => {
    const whenClause = await scenario
        .given()
        .coupon()
        .withCouponCode('SUMMER2025')
        .withDiscountRate(0.15)
        .when();
    const success = await whenClause.placeOrder().withCouponCode('SUMMER2025').then().shouldSucceed();
    const orderVerifier = await success.order();
    orderVerifier.hasAppliedCoupon('SUMMER2025').hasDiscountRate(0.15);
});

Channel(ChannelType.UI, ChannelType.API)('discount rate should not be applied when there is no coupon', async ({ scenario }) => {
    const success = await scenario.when().placeOrder().withCouponCode(null).then().shouldSucceed();
    const orderVerifier = await success.order();
    orderVerifier
        .hasStatus(OrderStatus.PLACED)
        .hasAppliedCoupon(null as unknown as string)
        .hasDiscountRate(0.0)
        .hasDiscountAmount(0.0);
});

Channel(ChannelType.UI, ChannelType.API)(
    'subtotal price should be calculated as base price minus discount when we have coupon',
    async ({ scenario }) => {
        const whenClause = await scenario.given().coupon().withDiscountRate(0.15).and().product().withUnitPrice(20.0).when();
        const success = await whenClause.placeOrder().withCouponCode().withQuantity(5).then().shouldSucceed();
        const orderVerifier = await success.order();
        orderVerifier
            .hasAppliedCoupon()
            .hasDiscountRate(0.15)
            .hasBasePrice(100.0)
            .hasDiscountAmount(15.0)
            .hasSubtotalPrice(85.0);
    }
);

Channel(ChannelType.UI, ChannelType.API)('subtotal price should be same as base price when no coupon', async ({ scenario }) => {
    const whenClause = await scenario.given().product().withUnitPrice(20.0).when();
    const success = await whenClause.placeOrder().withQuantity(5).then().shouldSucceed();
    const orderVerifier = await success.order();
    orderVerifier.hasBasePrice(100.0).hasDiscountAmount(0.0).hasSubtotalPrice(100.0);
});

const taxRateCases = [
    { country: 'UK', taxRate: '0.09' },
    { country: 'US', taxRate: '0.20' },
];

Channel(ChannelType.UI, ChannelType.API)('correct tax rate should be used based on country', async ({ scenario }) => {
    for (const { country, taxRate } of taxRateCases) {
        const whenClause = await scenario.given().country().withCode(country).withTaxRate(taxRate).when();
        const success = await whenClause.placeOrder().withCountry(country).then().shouldSucceed();
        const orderVerifier = await success.order();
        orderVerifier.hasTaxRate(taxRate);
    }
});

const totalPriceCases = [
    { country: 'UK', taxRate: '0.09', subtotalPrice: '50.00', expectedTaxAmount: '4.50', expectedTotalPrice: '54.50' },
    { country: 'US', taxRate: '0.20', subtotalPrice: '100.00', expectedTaxAmount: '20.00', expectedTotalPrice: '120.00' },
];

Channel(ChannelType.UI, ChannelType.API)(
    'total price should be subtotal price plus tax amount',
    async ({ scenario }) => {
        for (const { country, taxRate, subtotalPrice, expectedTaxAmount, expectedTotalPrice } of totalPriceCases) {
            const whenClause = await scenario
                .given()
                .country()
                .withCode(country)
                .withTaxRate(taxRate)
                .and()
                .product()
                .withUnitPrice(subtotalPrice)
                .when();
            const success = await whenClause.placeOrder().withCountry(country).withQuantity(1).then().shouldSucceed();
            const orderVerifier = await success.order();
            orderVerifier
                .hasTaxRate(taxRate)
                .hasSubtotalPrice(subtotalPrice)
                .hasTaxAmount(expectedTaxAmount)
                .hasTotalPrice(expectedTotalPrice);
        }
    }
);

Channel(ChannelType.UI, ChannelType.API)('coupon usage count has been incremented after its been used', async ({ scenario }) => {
    const whenClause = await scenario.given().coupon().withCouponCode('SUMMER2025').when();
    const success = await whenClause.placeOrder().withCouponCode('SUMMER2025').then().shouldSucceed();
    const couponVerifier = await success.coupon('SUMMER2025');
    couponVerifier.hasUsedCount(1);
});
