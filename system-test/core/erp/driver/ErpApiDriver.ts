import { AxiosInstance } from 'axios';
import { Result } from '@optivem/lang';
import { ErpApiClient } from './client/ErpApiClient.js';
import { HttpClientFactory } from '@optivem/http';
import { Closer } from '@optivem/lang';
import { Error, toError } from '../../commons/error/index.js';

export class ErpApiDriver {
    private readonly httpClient: AxiosInstance;
    private readonly apiClient: ErpApiClient;

    constructor(baseUrl: string) {
        this.httpClient = HttpClientFactory.create(baseUrl);
        this.apiClient = new ErpApiClient(this.httpClient, baseUrl);
    }

    async goToErp(): Promise<Result<void, Error>> {
        const result = await this.apiClient.health().checkHealth();
        return result.mapFailure(toError);
    }

    async createProduct(sku: string, price: string): Promise<Result<void, Error>> {
        const result = await this.apiClient.products().createProduct(sku, price);
        return result.mapFailure(toError);
    }

    close(): void {
        Closer.close(this.httpClient);
    }
}
