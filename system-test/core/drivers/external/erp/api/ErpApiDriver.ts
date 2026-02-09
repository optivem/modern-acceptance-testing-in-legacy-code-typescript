import { AxiosInstance } from 'axios';
import { Result } from '@optivem/testing-dsl';
import { ErpApiClient } from './client/ErpApiClient.js';
import { HttpClientFactory } from '@optivem/http';
import { Closer } from '@optivem/util';

export class ErpApiDriver {
    private readonly httpClient: AxiosInstance;
    private readonly apiClient: ErpApiClient;

    constructor(baseUrl: string) {
        this.httpClient = HttpClientFactory.create(baseUrl);
        this.apiClient = new ErpApiClient(this.httpClient, baseUrl);
    }

    async goToErp(): Promise<Result<void>> {
        return this.apiClient.health().checkHealth();
    }

    async createProduct(sku: string, price: string): Promise<Result<void>> {
        return this.apiClient.products().createProduct(sku, price);
    }

    close(): void {
        Closer.close(this.httpClient);
    }
}
