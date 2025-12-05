import { HttpGateway } from '../../../../../commons/clients/HttpGateway.js';
import { HttpUtils } from '../../../../../commons/clients/HttpUtils.js';
import { Result } from '../../../../../commons/Result.js';
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
