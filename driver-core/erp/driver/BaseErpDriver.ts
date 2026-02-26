import { Result } from '@optivem/common/util';
import type { BaseErpClient } from '../client/BaseErpClient.js';
import type { ErpDriver } from '@optivem/driver-api/erp/ErpDriver.js';
import type { ErpErrorResponse } from '@optivem/driver-api/erp/dtos/error/ErpErrorResponse.js';
import type { GetProductRequest } from '@optivem/driver-api/erp/dtos/GetProductRequest.js';
import type { GetProductResponse } from '@optivem/driver-api/erp/dtos/GetProductResponse.js';
import type { ReturnsProductRequest } from '@optivem/driver-api/erp/dtos/ReturnsProductRequest.js';
import { from as fromGetProductResponse } from './GetProductResponseMapper.js';
import { from as fromErpErrorResponse } from './ErpErrorResponseMapper.js';

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
