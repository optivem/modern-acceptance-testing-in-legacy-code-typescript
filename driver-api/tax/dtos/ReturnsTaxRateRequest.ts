import type { Optional } from '@optivem/common/util';

export interface ReturnsTaxRateRequest {
	country?: Optional<string>;
	taxRate?: Optional<string>;
}
