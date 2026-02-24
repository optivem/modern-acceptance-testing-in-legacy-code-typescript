import type { Decimal } from '@optivem/commons/util';

export interface GetTaxResponse {
    country: string;
    taxRate: Decimal;
}
