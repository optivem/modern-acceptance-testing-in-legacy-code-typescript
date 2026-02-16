import type { Decimal } from '@optivem/commons/util';
import type { ExtCountryDetailsResponse } from '../../../client/dtos/ExtCountryDetailsResponse.js';

export interface GetTaxResponse {
    country: string;
    taxRate: Decimal;
}

export function from(ext: ExtCountryDetailsResponse): GetTaxResponse {
    return {
        country: ext.id ?? '',
        taxRate: ext.taxRate!,
    };
}