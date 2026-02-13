import type { ExtErpErrorResponse } from '../../../client/dtos/error/ExtErpErrorResponse.js';

export interface ErpErrorResponse {
    message?: string;
}

export function from(ext: ExtErpErrorResponse): ErpErrorResponse {
    return { message: ext.message };
}
