import { TestHttpClient } from '../../../../../commons/clients/TestHttpClient.js';
import { TestHttpUtils } from '../../../../../commons/clients/TestHttpUtils.js';
import { Result } from '../../../../../commons/Result.js';
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
