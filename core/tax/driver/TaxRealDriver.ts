import { Result } from '@optivem/commons/util';
import { TaxRealClient } from '../client/TaxRealClient.js';
import type { ReturnsTaxRateRequest } from './dtos/ReturnsTaxRateRequest.js';
import type { TaxErrorResponse } from './dtos/error/TaxErrorResponse.js';
import { BaseTaxDriver } from './BaseTaxDriver.js';

export class TaxRealDriver extends BaseTaxDriver<TaxRealClient> {
    constructor(baseUrl: string) {
        super(new TaxRealClient(baseUrl));
    }

    returnsTaxRate(request: ReturnsTaxRateRequest): Promise<Result<void, TaxErrorResponse>> {
        return Promise.resolve(Result.success());
    }
}
