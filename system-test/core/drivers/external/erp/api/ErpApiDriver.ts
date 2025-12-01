import { TestHttpClient } from '../../../commons/clients/TestHttpClient.js';
import { Result } from '../../../commons/Result.js';

export class ErpApiDriver {
    private readonly httpClient: TestHttpClient;

    constructor(baseUrl: string) {
        this.httpClient = new TestHttpClient(baseUrl);
    }

    async createProduct(sku: string, price: string): Promise<Result<string>> {
        const request = { id: sku, sku, price };
        const response = await this.httpClient.post('/api/products', request);
        
        if (response.status === 201) {
            return Result.success(response.data as string);
        }
        
        return Result.failure([response.statusText || 'Failed to create product']);
    }

    close(): void {
        // Cleanup if needed
    }
}
