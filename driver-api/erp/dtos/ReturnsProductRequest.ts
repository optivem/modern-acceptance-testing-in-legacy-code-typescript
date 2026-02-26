import type { Optional } from '@optivem/common/util';

export interface ReturnsProductRequest {
	sku?: Optional<string>;
	price?: Optional<string>;
}
