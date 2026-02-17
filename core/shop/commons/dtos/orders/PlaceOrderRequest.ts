import type { Optional } from '@optivem/commons/util';

export interface PlaceOrderRequest {
    sku?: Optional<string>;
    quantity?: Optional<string>;
    country?: Optional<string>;
    couponCode?: Optional<string>;
}
