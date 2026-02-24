import type { TaxErrorResponse } from '@optivem/driver-api/tax/driver/dtos/error/TaxErrorResponse.js';
import type { ExtTaxErrorResponse } from '../client/dtos/error/ExtTaxErrorResponse.js';

export function from(ext: ExtTaxErrorResponse): TaxErrorResponse {
    return { message: ext.message };
}
