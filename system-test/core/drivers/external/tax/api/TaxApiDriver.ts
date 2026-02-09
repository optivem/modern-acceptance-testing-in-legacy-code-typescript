import { AxiosInstance } from 'axios';
import { Result } from '@optivem/commons-testing-dsl';
import { TaxApiClient } from './client/TaxApiClient.js';
import { HttpClientFactory } from '@optivem/commons-http';
import { Closer } from '@optivem/commons-util';

export class TaxApiDriver {
    private readonly httpClient: AxiosInstance;
    private readonly apiClient: TaxApiClient;

    constructor(baseUrl: string) {
        this.httpClient = HttpClientFactory.create(baseUrl);
        this.apiClient = new TaxApiClient(this.httpClient, baseUrl);
    }

    async goToTax(): Promise<Result<void>> {
        return this.apiClient.health().checkHealth();
    }

    close(): void {
        Closer.close(this.httpClient);
    }
}
