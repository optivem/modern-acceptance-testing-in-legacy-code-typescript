import type { Optional } from '@optivem/common/util';

export interface PublishCouponRequest {
	code?: Optional<string>;
	discountRate?: Optional<string>;
	validFrom?: Optional<string>;
	validTo?: Optional<string>;
	usageLimit?: Optional<string>;
}
