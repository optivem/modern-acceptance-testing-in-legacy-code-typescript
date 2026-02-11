import { AxiosInstance } from 'axios';
import { ShopDriver } from '../ShopDriver.js';
import { ShopApiClient } from './client/ShopApiClient.js';
import { Result } from '@optivem/commons/util';
import { PlaceOrderRequest } from '../dtos/PlaceOrderRequest.js';
import { PlaceOrderResponse } from '../dtos/PlaceOrderResponse.js';
import { GetOrderResponse } from '../dtos/GetOrderResponse.js';
import { HttpClientFactory } from '@optivem/commons/http';
import { Closer } from '@optivem/commons/util';
import { Error, toError } from '../../../commons/error/index.js';

export class ShopApiDriver implements ShopDriver {
    private readonly httpClient: AxiosInstance;
    private readonly client: ShopApiClient;

    constructor(baseUrl: string) {
        this.httpClient = HttpClientFactory.create(baseUrl);
        this.client = new ShopApiClient(this.httpClient, baseUrl);
    }

    async goToShop(): Promise<Result<void, Error>> {
        const result = await this.client.health.checkHealth();
        return result.mapFailure(toError);
    }

    async placeOrder(sku: string, quantity: string, country: string): Promise<Result<PlaceOrderResponse, Error>> {
        const request: PlaceOrderRequest = {
            sku,
            quantity,
            country,
        };
        const result = await this.client.order.placeOrder(request);
        return result.mapFailure(toError);
    }

    async viewOrder(orderNumber: string): Promise<Result<GetOrderResponse, Error>> {
        const result = await this.client.order.getOrder(orderNumber);
        return result.mapFailure(toError);
    }

    async cancelOrder(orderNumber: string): Promise<Result<void, Error>> {
        const result = await this.client.order.cancelOrder(orderNumber);
        return result.mapFailure(toError);
    }

    async close(): Promise<void> {
        Closer.close(this.httpClient);
    }
}


