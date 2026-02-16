import type { ExtTaxErrorResponse } from '../../../client/dtos/error/ExtTaxErrorResponse.js';

export interface TaxErrorResponse {
    message?: string;
}

export function from(ext: ExtTaxErrorResponse): TaxErrorResponse {
    return { message: ext.message };
}
