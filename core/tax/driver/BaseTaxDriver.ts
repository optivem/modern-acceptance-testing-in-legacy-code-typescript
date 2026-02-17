import type { Optional } from '@optivem/commons/util';
import { Result } from '@optivem/commons/util';
import type { BaseTaxClient } from '../client/BaseTaxClient.js';
import type { GetTaxResponse } from './dtos/GetTaxResponse.js';
import { from as fromGetTaxResponse } from './dtos/GetTaxResponse.js';
import type { ReturnsTaxRateRequest } from './dtos/ReturnsTaxRateRequest.js';
import type { TaxErrorResponse } from './dtos/error/TaxErrorResponse.js';
import { from as fromTaxErrorResponse } from './dtos/error/TaxErrorResponse.js';
import type { TaxDriver } from './TaxDriver.js';

export abstract class BaseTaxDriver<TClient extends BaseTaxClient> implements TaxDriver {
    protected readonly client: TClient;

    protected constructor(client: TClient) {
        this.client = client;
    }

    close(): void {
        // Tax client has no resources to close; driver close is no-op for tax.
    }

    goToTax(): Promise<Result<void, TaxErrorResponse>> {
        return this.client.checkHealth().then((r) => r.mapError(fromTaxErrorResponse));
    }

    getTaxRate(country: Optional<string>): Promise<Result<GetTaxResponse, TaxErrorResponse>> {
        return this.client
            .getCountry(country)
            .then((r) => r.map(fromGetTaxResponse).mapError(fromTaxErrorResponse));
    }

    abstract returnsTaxRate(request: ReturnsTaxRateRequest): Promise<Result<void, TaxErrorResponse>>;
}
