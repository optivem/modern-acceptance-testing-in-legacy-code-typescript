import { AxiosInstance } from 'axios';
import { Result } from '@optivem/commons/util';
import { TaxApiClient } from './client/TaxApiClient.js';
import { HttpClientFactory } from '@optivem/commons/http';
import { Closer } from '@optivem/commons/util';
import { Error, toError } from '../../commons/error/index.js';

export class TaxApiDriver {
    private readonly httpClient: AxiosInstance;
    private readonly apiClient: TaxApiClient;

    constructor(baseUrl: string) {
        this.httpClient = HttpClientFactory.create(baseUrl);
        this.apiClient = new TaxApiClient(this.httpClient, baseUrl);
    }

    async goToTax(): Promise<Result<void, Error>> {
        const result = await this.apiClient.health().checkHealth();
        return result.mapError(toError);
    }

    close(): void {
        Closer.close(this.httpClient);
    }
}


