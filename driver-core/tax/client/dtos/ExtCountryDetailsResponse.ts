import type { Decimal } from '@optivem/common/util';

export interface ExtCountryDetailsResponse {
    id?: string;
    countryName?: string;
    taxRate?: Decimal;
}
