import type { Decimal } from '@optivem/commons/util';

export interface ExtProductDetailsResponse {
    id: string;
    title: string;
    description: string;
    price: Decimal;
    category: string;
    brand: string;
}
