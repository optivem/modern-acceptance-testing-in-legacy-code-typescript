import { TestHttpClient } from '../../../commons/clients/TestHttpClient.js';
import { Result } from '../../../commons/Result.js';
import { TestHttpUtils } from '../../../commons/clients/TestHttpUtils.js';

export class ErpApiDriver {
    private readonly httpClient: TestHttpClient;

    constructor(baseUrl: string) {
        this.httpClient = new TestHttpClient(baseUrl);
    }

    async checkHome(): Promise<Result<void>> {
        const response = await this.httpClient.get<void>('/health');
        return TestHttpUtils.getOkResultOrFailure<void>(response);
    }

    async getProducts(): Promise<Result<void>> {
        const response = await this.httpClient.get<void>('/api/products');
        return TestHttpUtils.getOkResultOrFailure<void>(response);
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
