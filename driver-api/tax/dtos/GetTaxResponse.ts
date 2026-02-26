import type { Decimal } from '@optivem/common/util';

export interface GetTaxResponse {
	country: string;
	taxRate: Decimal;
}
