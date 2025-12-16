import { HttpGateway, HttpUtils, ProblemDetailResponse } from '@optivem/http';
import { Result } from '@optivem/lang';
import { CreateProductRequest } from '../dtos/CreateProductRequest.js';

export class ProductController {
    private static readonly ENDPOINT = '/api/products';
    private readonly httpClient: HttpGateway;

    constructor(httpClient: HttpGateway) {
        this.httpClient = httpClient;
    }

    async createProduct(sku: string, price: string): Promise<Result<void, ProblemDetailResponse>> {
        const request: CreateProductRequest = { id: sku, sku, price };
        const httpResponse = await this.httpClient.post<void>(
            ProductController.ENDPOINT,
            request
        );
        return HttpUtils.getCreatedResultOrFailure<void>(httpResponse);
    }
}
