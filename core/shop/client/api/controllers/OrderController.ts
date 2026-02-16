import type { JsonHttpClient } from '@optivem/commons/http';
import type { Result } from '@optivem/commons/util';
import type { ProblemDetailsResponse } from '../../dtos/errors/ProblemDetailsResponse.js';
import type { PlaceOrderRequest, PlaceOrderResponse, ViewOrderResponse } from '../../../commons/dtos/orders/index.js';

export class OrderController {
    private static readonly ENDPOINT = '/api/orders';

    constructor(private readonly httpClient: JsonHttpClient<ProblemDetailsResponse>) {}

    placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, ProblemDetailsResponse>> {
        return this.httpClient.postAsync<PlaceOrderResponse>(OrderController.ENDPOINT, request);
    }

    viewOrder(orderNumber: string): Promise<Result<ViewOrderResponse, ProblemDetailsResponse>> {
        return this.httpClient.getAsync<ViewOrderResponse>(`${OrderController.ENDPOINT}/${orderNumber}`);
    }

    cancelOrder(orderNumber: string): Promise<Result<void, ProblemDetailsResponse>> {
        return this.httpClient.postAsync<void>(`${OrderController.ENDPOINT}/${orderNumber}/cancel`, {});
    }
}
