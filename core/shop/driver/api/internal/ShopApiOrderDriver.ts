import type { ShopApiClient } from '../../../client/api/ShopApiClient.js';
import type { OrderDriver } from '../../internal/OrderDriver.js';
import type { PlaceOrderRequest, PlaceOrderResponse, ViewOrderResponse } from '../../../commons/dtos/orders/index.js';
import type { SystemError } from '../../../commons/dtos/errors/SystemError.js';
import { systemErrorFrom } from '../../../commons/dtos/errors/SystemError.js';
import type { Result } from '@optivem/commons/util';

export class ShopApiOrderDriver implements OrderDriver {
    constructor(private readonly apiClient: ShopApiClient) {}

    placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>> {
        return this.apiClient.orders()
            .placeOrder(request)
            .then((r) => r.mapError((e) => systemErrorFrom(e)));
    }

    cancelOrder(orderNumber: string): Promise<Result<void, SystemError>> {
        return this.apiClient.orders()
            .cancelOrder(orderNumber)
            .then((r) => r.mapError((e) => systemErrorFrom(e)));
    }

    viewOrder(orderNumber: string): Promise<Result<ViewOrderResponse, SystemError>> {
        return this.apiClient
            .orders()
            .viewOrder(orderNumber)
            .then((r) => r.mapError((e) => systemErrorFrom(e)));
    }
}
