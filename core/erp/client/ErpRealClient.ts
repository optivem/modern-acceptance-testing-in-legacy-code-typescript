import { Result } from '@optivem/commons/util';
import { BaseErpClient } from './BaseErpClient.js';
import type { ExtCreateProductRequest } from './dtos/ExtCreateProductRequest.js';
import { from as toExtErpErrorResponse } from './dtos/error/ExtErpErrorResponse.js';
import type { ExtErpErrorResponse } from './dtos/error/ExtErpErrorResponse.js';
import { ProblemDetail } from '../../commons/error/index.js';

function toExtError(p: ProblemDetail): ExtErpErrorResponse {
    return toExtErpErrorResponse(p.detail ?? p.title ?? 'Request failed');
}

export class ErpRealClient extends BaseErpClient {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    createProduct(request: ExtCreateProductRequest): Promise<Result<void, ExtErpErrorResponse>> {
        return this.httpClient
            .postAsync<void>(ErpRealClient.PRODUCTS_ENDPOINT, request)
            .then((r) => r.mapError(toExtError));
    }
}
