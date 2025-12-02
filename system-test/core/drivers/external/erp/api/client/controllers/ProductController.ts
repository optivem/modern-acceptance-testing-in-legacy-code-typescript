import { TestHttpClient } from '../../../../../commons/clients/TestHttpClient.js';
import { TestHttpUtils } from '../../../../../commons/clients/TestHttpUtils.js';
import { Result } from '../../../../../commons/Result.js';
import { CreateProductRequest } from '../dtos/CreateProductRequest.js';
import { CreateProductResponse } from '../dtos/CreateProductResponse.js';
import { GetProductsResponse } from '../dtos/GetProductsResponse.js';

export class ProductController {
    private static readonly ENDPOINT = '/api/products';
    private readonly httpClient: TestHttpClient;

    constructor(httpClient: TestHttpClient) {
        this.httpClient = httpClient;
    }

    async getProducts(): Promise<Result<GetProductsResponse>> {
        const httpResponse = await this.httpClient.get<GetProductsResponse>(ProductController.ENDPOINT);
        return TestHttpUtils.getOkResultOrFailure<GetProductsResponse>(httpResponse);
    }

    async createProduct(sku: string, price: string): Promise<Result<string>> {
        const request: CreateProductRequest = { id: sku, sku, price };
        const httpResponse = await this.httpClient.post<CreateProductResponse>(
            ProductController.ENDPOINT,
            request
        );
        const result = TestHttpUtils.getCreatedResultOrFailure<CreateProductResponse>(httpResponse);
        if (result.isFailure()) {
            return Result.failure<string>(result.getErrorMessages());
        }
        const productId = result.getValue().id;
        return Result.success<string>(productId);
    }
}
