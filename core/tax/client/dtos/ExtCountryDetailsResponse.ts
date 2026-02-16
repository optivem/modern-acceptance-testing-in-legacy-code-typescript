import type { Decimal } from '@optivem/commons/util';

export interface ExtCountryDetailsResponse {
    id?: string;
    countryName?: string;
    taxRate?: Decimal;
}
