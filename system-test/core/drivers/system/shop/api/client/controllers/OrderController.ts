import { TestHttpClient, TestHttpUtils } from '@optivem/commons-http';
import { Result } from '@optivem/commons-testing-dsl';
import { PlaceOrderRequest } from '../../../../commons/dtos/PlaceOrderRequest.js';
import { PlaceOrderResponse } from '../../../../commons/dtos/PlaceOrderResponse.js';
import { GetOrderResponse } from '../../../../commons/dtos/GetOrderResponse.js';

export class OrderController {
    private static readonly ORDERS_PATH = '/api/orders';

    constructor(private readonly httpClient: TestHttpClient) {}

    async placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse>> {
        const response = await this.httpClient.post<PlaceOrderResponse>(OrderController.ORDERS_PATH, request);
        return TestHttpUtils.getCreatedResultOrFailure(response);
    }

    async getOrder(orderNumber: string): Promise<Result<GetOrderResponse>> {
        const path = `${OrderController.ORDERS_PATH}/${orderNumber}`;
        const response = await this.httpClient.get<GetOrderResponse>(path);
        return TestHttpUtils.getOkResultOrFailure(response);
    }

    async cancelOrder(orderNumber: string): Promise<Result<void>> {
        const path = `${OrderController.ORDERS_PATH}/${orderNumber}/cancel`;
        const response = await this.httpClient.post<void>(path, {});
        return TestHttpUtils.getNoContentResultOrFailure(response);
    }
}
