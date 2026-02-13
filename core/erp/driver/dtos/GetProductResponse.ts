import type { Decimal } from '@optivem/commons/util';
import type { ExtProductDetailsResponse } from '../../client/dtos/ExtProductDetailsResponse.js';

export interface GetProductResponse {
    sku: string;
    price: Decimal;
}

export function from(ext: ExtProductDetailsResponse): GetProductResponse {
    return {
        sku: ext.id,
        price: ext.price,
    };
}
