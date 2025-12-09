import { HttpGateway, HttpUtils } from '@optivem/http';
import { Result } from '@optivem/results';
import { CreateProductRequest } from '../dtos/CreateProductRequest.js';

export class ProductController {
    private static readonly ENDPOINT = '/api/products';
    private readonly httpClient: HttpGateway;

    constructor(httpClient: HttpGateway) {
        this.httpClient = httpClient;
    }

    async createProduct(sku: string, price: string): Promise<Result<void>> {
        const request: CreateProductRequest = { id: sku, sku, price };
        const httpResponse = await this.httpClient.post<void>(
            ProductController.ENDPOINT,
            request
        );
        const result = HttpUtils.getCreatedResultOrFailure<void>(httpResponse);
        if (result.isFailure()) {
            return Result.failure(result.getErrorMessages());
        }
        return Result.success();
    }
}
