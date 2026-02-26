import type { Optional } from '@optivem/commons/util';
import { Result } from '@optivem/commons/util';
import type { BaseTaxClient } from '../client/BaseTaxClient.js';
import type { TaxDriver } from '@optivem/driver-api/tax/TaxDriver.js';
import type { GetTaxResponse } from '@optivem/driver-api/tax/dtos/GetTaxResponse.js';
import type { ReturnsTaxRateRequest } from '@optivem/driver-api/tax/dtos/ReturnsTaxRateRequest.js';
import type { TaxErrorResponse } from '@optivem/driver-api/tax/dtos/error/TaxErrorResponse.js';
import { from as fromGetTaxResponse } from './GetTaxResponseMapper.js';
import { from as fromTaxErrorResponse } from './TaxErrorResponseMapper.js';

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
