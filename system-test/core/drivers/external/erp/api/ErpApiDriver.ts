import { AxiosInstance } from 'axios';
import { Result } from '../../../../../results/Result.js';
import { ErpApiClient } from './client/ErpApiClient.js';
import { HttpClientFactory } from '../../../../../http/HttpClientFactory.js';
import { Closer } from '../../../../../lang/Closer.js';

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
