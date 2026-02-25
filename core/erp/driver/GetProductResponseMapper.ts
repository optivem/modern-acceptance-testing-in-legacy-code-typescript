import type { GetProductResponse } from '@optivem/driver-api/erp/dtos/GetProductResponse.js';
import type { ExtProductDetailsResponse } from '../client/dtos/ExtProductDetailsResponse.js';

export function from(ext: ExtProductDetailsResponse): GetProductResponse {
    return {
        sku: ext.id,
        price: ext.price,
    };
}
