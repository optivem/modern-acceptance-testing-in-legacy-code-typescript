import type { Optional } from '@optivem/common/util';

export interface PlaceOrderRequest {
	sku?: Optional<string>;
	quantity?: Optional<string>;
	country?: Optional<string>;
	couponCode?: Optional<string>;
}
