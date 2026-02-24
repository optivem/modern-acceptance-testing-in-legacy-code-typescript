import type { Optional } from '@optivem/commons/util';

export interface ReturnsProductRequest {
    sku?: Optional<string>;
    price?: Optional<string>;
}
