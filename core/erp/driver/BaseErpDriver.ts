import { Result } from '@optivem/commons/util';
import type { BaseErpClient } from '../client/BaseErpClient.js';
import type { ErpErrorResponse } from './dtos/error/ErpErrorResponse.js';
import type { GetProductRequest } from './dtos/GetProductRequest.js';
import type { GetProductResponse } from './dtos/GetProductResponse.js';
import { from as fromGetProductResponse } from './dtos/GetProductResponse.js';
import type { ReturnsProductRequest } from './dtos/ReturnsProductRequest.js';
import { from as fromErpErrorResponse } from './dtos/error/ErpErrorResponse.js';
import type { ErpDriver } from './ErpDriver.js';

export abstract class BaseErpDriver<TClient extends BaseErpClient> implements ErpDriver {
    protected readonly client: TClient;

    protected constructor(client: TClient) {
        this.client = client;
    }

    goToErp(): Promise<Result<void, ErpErrorResponse>> {
        return this.client.checkHealth().then((r) => r.mapError(fromErpErrorResponse));
    }

    getProduct(request: GetProductRequest): Promise<Result<GetProductResponse, ErpErrorResponse>> {
        return this.client
            .getProduct(request.sku)
            .then((r) => r.map(fromGetProductResponse).mapError(fromErpErrorResponse));
    }

    abstract returnsProduct(request: ReturnsProductRequest): Promise<Result<void, ErpErrorResponse>>;
}
