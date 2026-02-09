import { TestHttpClient, TestHttpUtils } from '@optivem/commons-http';
import { Result } from '@optivem/commons-testing-dsl';
import { CreateProductRequest } from '../dtos/CreateProductRequest.js';

export class ProductController {
    private static readonly ENDPOINT = '/api/products';
    private readonly httpClient: TestHttpClient;

    constructor(httpClient: TestHttpClient) {
        this.httpClient = httpClient;
    }

    async createProduct(sku: string, price: string): Promise<Result<void>> {
        const request: CreateProductRequest = { id: sku, sku, price };
        const httpResponse = await this.httpClient.post<void>(
            ProductController.ENDPOINT,
            request
        );
        const result = TestHttpUtils.getCreatedResultOrFailure<void>(httpResponse);
        if (result.isFailure()) {
            return Result.failure(result.getErrorMessages());
        }
        return Result.success();
    }
}
