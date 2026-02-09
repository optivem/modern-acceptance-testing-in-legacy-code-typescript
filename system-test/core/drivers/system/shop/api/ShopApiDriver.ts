import { AxiosInstance } from 'axios';
import { ShopDriver } from '../../ShopDriver.js';
import { ShopApiClient } from './client/ShopApiClient.js';
import { Result } from '@optivem/testing-dsl';
import { PlaceOrderRequest } from '../../commons/dtos/PlaceOrderRequest.js';
import { PlaceOrderResponse } from '../../commons/dtos/PlaceOrderResponse.js';
import { GetOrderResponse } from '../../commons/dtos/GetOrderResponse.js';
import { HttpClientFactory } from '@optivem/http';
import { Closer } from '@optivem/util';

export class ShopApiDriver implements ShopDriver {
    private readonly httpClient: AxiosInstance;
    private readonly client: ShopApiClient;

    constructor(baseUrl: string) {
        this.httpClient = HttpClientFactory.create(baseUrl);
        this.client = new ShopApiClient(this.httpClient, baseUrl);
    }

    async goToShop(): Promise<Result<void>> {
        return await this.client.health.checkHealth();
    }

    async placeOrder(sku: string, quantity: string, country: string): Promise<Result<PlaceOrderResponse>> {
        const request: PlaceOrderRequest = {
            sku,
            quantity,
            country,
        };
        return await this.client.order.placeOrder(request);
    }

    async viewOrder(orderNumber: string): Promise<Result<GetOrderResponse>> {
        return await this.client.order.getOrder(orderNumber);
    }

    async cancelOrder(orderNumber: string): Promise<Result<void>> {
        return await this.client.order.cancelOrder(orderNumber);
    }

    async close(): Promise<void> {
        Closer.close(this.httpClient);
    }
}
