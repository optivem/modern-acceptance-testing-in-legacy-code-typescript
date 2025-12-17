import { HttpGateway, HttpUtils, ProblemDetailResponse } from '@optivem/http';
import { Result } from '@optivem/lang';
import { PlaceOrderRequest } from '../../../dtos/PlaceOrderRequest.js';
import { PlaceOrderResponse } from '../../../dtos/PlaceOrderResponse.js';
import { GetOrderResponse } from '../../../dtos/GetOrderResponse.js';

export class OrderController {
    private static readonly ORDERS_PATH = '/api/orders';

    constructor(private readonly httpClient: HttpGateway) {}

    async placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, ProblemDetailResponse>> {
        const response = await this.httpClient.post<PlaceOrderResponse>(OrderController.ORDERS_PATH, request);
        return HttpUtils.getCreatedResultOrFailure(response);
    }

    async getOrder(orderNumber: string): Promise<Result<GetOrderResponse, ProblemDetailResponse>> {
        const path = `${OrderController.ORDERS_PATH}/${orderNumber}`;
        const response = await this.httpClient.get<GetOrderResponse>(path);
        return HttpUtils.getOkResultOrFailure(response);
    }

    async cancelOrder(orderNumber: string): Promise<Result<void, ProblemDetailResponse>> {
        const path = `${OrderController.ORDERS_PATH}/${orderNumber}/cancel`;
        const response = await this.httpClient.post<void>(path, {});
        return HttpUtils.getNoContentResultOrFailure(response);
    }
}


