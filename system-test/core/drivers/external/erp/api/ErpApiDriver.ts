import { Result } from '../../../commons/Result.js';
import { ErpApiClient } from './client/ErpApiClient.js';

export class ErpApiDriver {
    private readonly apiClient: ErpApiClient;

    constructor(baseUrl: string) {
        this.apiClient = new ErpApiClient(baseUrl);
    }

    async checkHome(): Promise<Result<void>> {
        return this.apiClient.health().checkHealth();
    }

    async getProducts(): Promise<Result<any>> {
        return this.apiClient.products().getProducts();
    }

    async createProduct(sku: string, price: string): Promise<Result<string>> {
        return this.apiClient.products().createProduct(sku, price);
    }

    close(): void {
        this.apiClient.close();
    }
}
