import { Result } from '@optivem/commons/util';
import { JsonHttpClient, DEFAULT_DECIMAL_KEYS } from '@optivem/commons/http';
import { ProblemDetail } from '../../commons/error/index.js';
import type { ExtProductDetailsResponse } from './dtos/ExtProductDetailsResponse.js';
import { from as toExtErpErrorResponse, type ExtErpErrorResponse } from './dtos/error/ExtErpErrorResponse.js';

function toExtError(p: ProblemDetail): ExtErpErrorResponse {
    return toExtErpErrorResponse(p.detail);
}

export abstract class BaseErpClient {
    protected static readonly HEALTH_ENDPOINT = '/health';
    protected static readonly PRODUCTS_ENDPOINT = '/api/products';

    protected readonly httpClient: JsonHttpClient<ProblemDetail>;

    protected constructor(baseUrl: string) {
        this.httpClient = new JsonHttpClient<ProblemDetail>(baseUrl, {
            decimalKeys: DEFAULT_DECIMAL_KEYS,
        });
    }

    checkHealth(): Promise<Result<void, ExtErpErrorResponse>> {
        return this.httpClient.getAsync<void>(BaseErpClient.HEALTH_ENDPOINT).then((r) => r.mapError(toExtError));
    }

    getProduct(sku: string | undefined): Promise<Result<ExtProductDetailsResponse, ExtErpErrorResponse>> {
        return this.httpClient
            .getAsync<ExtProductDetailsResponse>(`${BaseErpClient.PRODUCTS_ENDPOINT}/${sku}`)
            .then((r) => r.mapError(toExtError));
    }
}
