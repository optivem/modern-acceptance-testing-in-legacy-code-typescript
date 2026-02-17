import type { Optional } from '@optivem/commons/util';

export interface ReturnsTaxRateRequest {
    country?: Optional<string>;
    taxRate?: Optional<string>;
}
