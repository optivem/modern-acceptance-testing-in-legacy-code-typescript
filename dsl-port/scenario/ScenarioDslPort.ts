import type { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';

export type StringInput = string | null | undefined;
export type NumberLikeInput = number | string;
export type NullableNumberLikeInput = number | string | null | undefined;

export interface ScenarioDslPort {
    assume(): AssumeStagePort;
    given(): GivenClausePort;
    when(): WhenClausePort;
    markAsExecuted(): void;
}

export interface AssumeStagePort {
    shop(): ShouldPort;
    erp(): ShouldPort;
    tax(): ShouldPort;
    clock(): ShouldPort;
}

export interface ShouldPort {
    shouldBeRunning(): Promise<AssumeStagePort>;
}

export interface GivenClausePort {
    product(): GivenProductPort;
    order(): GivenOrderPort;
    clock(): GivenClockPort;
    country(): GivenCountryPort;
    coupon(): GivenCouponPort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
    and(): GivenClausePort;
}

export interface GivenProductPort {
    withSku(sku: StringInput): this;
    withUnitPrice(unitPrice: NumberLikeInput | undefined): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
}

export interface GivenOrderPort {
    withOrderNumber(orderNumber: StringInput): this;
    withSku(sku: StringInput): this;
    withQuantity(quantity: number | string | null | undefined): this;
    withCountry(country: StringInput): this;
    withCouponCode(couponCodeAlias: StringInput): this;
    withStatus(status: OrderStatus): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
}

export interface GivenClockPort {
    withTime(time: StringInput): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
}

export interface GivenCountryPort {
    withCode(country: StringInput): this;
    withTaxRate(taxRate: NumberLikeInput | undefined): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
}

export interface GivenCouponPort {
    withCouponCode(couponCode: StringInput): this;
    withDiscountRate(discountRate: NumberLikeInput | undefined): this;
    withValidFrom(validFrom: StringInput): this;
    withValidTo(validTo: StringInput): this;
    withUsageLimit(usageLimit: number | string | null | undefined): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
}

export interface WhenClausePort {
    goToShop(): WhenActionPort;
    placeOrder(): WhenPlaceOrderPort;
    cancelOrder(): WhenCancelOrderPort;
    viewOrder(): WhenViewOrderPort;
    publishCoupon(): WhenPublishCouponPort;
    browseCoupons(): WhenActionPort;
}

export interface WhenActionPort {
    then(): ThenClausePort;
}

export interface WhenPlaceOrderPort {
    withOrderNumber(orderNumber: StringInput): this;
    withSku(sku: StringInput): this;
    withQuantity(quantity: NullableNumberLikeInput): this;
    withCountry(country: StringInput): this;
    withCouponCode(couponCode: StringInput): this;
    withCouponCode(): this;
    then(): ThenClausePort;
}

export interface WhenCancelOrderPort {
    withOrderNumber(orderNumber: StringInput): this;
    then(): ThenClausePort;
}

export interface WhenViewOrderPort {
    withOrderNumber(orderNumber: StringInput): this;
    then(): ThenClausePort;
}

export interface WhenPublishCouponPort {
    withCouponCode(couponCode: StringInput): this;
    withDiscountRate(discountRate: NumberLikeInput | undefined): this;
    withValidFrom(validFrom: StringInput): this;
    withValidTo(validTo: StringInput): this;
    withUsageLimit(usageLimit: number | string | null | undefined): this;
    then(): ThenClausePort;
}

export interface ThenGivenStagePort {
    clock(): Promise<ThenGivenClockPort>;
    product(skuAlias: string): Promise<ThenGivenProductPort>;
    country(countryAlias: string): Promise<ThenGivenCountryPort>;
}

export interface ThenGivenClockPort {
    hasTime(time: string): ThenGivenClockPort;
    hasTime(): ThenGivenClockPort;
}

export interface ThenGivenProductPort {
    hasSku(sku: string): ThenGivenProductPort;
    hasPrice(price: number): ThenGivenProductPort;
}

export interface ThenGivenCountryPort {
    hasCountry(country: string): ThenGivenCountryPort;
    hasTaxRate(taxRate: number): ThenGivenCountryPort;
    hasTaxRateIsPositive(): ThenGivenCountryPort;
}

export interface ThenClausePort {
    shouldSucceed(): ThenSuccessPort;
    shouldFail(): ThenFailurePort;
}

export interface ThenSuccessPort extends PromiseLike<void> {
    and(): this;
    order(orderNumber?: string): ThenOrderPort;
    coupon(couponCode?: string): ThenCouponPort;
}

export interface ThenFailurePort extends PromiseLike<void> {
    errorMessage(expectedMessage: string): this;
    fieldErrorMessage(expectedField: string, expectedMessage: string): this;
    and(): ThenFailureAndPort;
}

export interface ThenFailureAndPort {
    order(orderNumber?: string): ThenOrderPort;
    coupon(couponCode?: string): ThenCouponPort;
}

export interface ThenOrderPort extends PromiseLike<void> {
    and(): this;
    hasSku(expectedSku: string): this;
    hasQuantity(expectedQuantity: number): this;
    hasCountry(expectedCountry: string): this;
    hasUnitPrice(expectedUnitPrice: number): this;
    hasBasePrice(basePrice: number | string): this;
    hasSubtotalPrice(subtotalPrice: number | string): this;
    hasTotalPrice(totalPrice: number | string): this;
    hasStatus(expectedStatus: OrderStatus): this;
    hasDiscountRateGreaterThanOrEqualToZero(): this;
    hasDiscountRate(discountRate: number): this;
    hasDiscountAmount(discountAmount: number | string): this;
    hasAppliedCoupon(expectedCouponCode: string | null): this;
    hasAppliedCoupon(): this;
    hasDiscountAmountGreaterThanOrEqualToZero(): this;
    hasSubtotalPriceGreaterThanZero(): this;
    hasTaxRate(taxRate: number | string): this;
    hasTaxRateGreaterThanOrEqualToZero(): this;
    hasTaxAmount(taxAmount: number | string): this;
    hasTaxAmountGreaterThanOrEqualToZero(): this;
    hasTotalPriceGreaterThanZero(): this;
    hasOrderNumberPrefix(expectedPrefix: string): this;
}

export interface ThenCouponPort extends PromiseLike<void> {
    and(): this;
    hasDiscountRate(discountRate: number): this;
    isValidFrom(validFrom: string): this;
    isValidTo(validTo: string): this;
    hasUsageLimit(usageLimit: number): this;
    hasUsedCount(usedCount: number): this;
}

