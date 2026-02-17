import type { Optional } from '@optivem/commons/util';
import type { Result } from '@optivem/commons/util';
import type { PlaceOrderRequest, PlaceOrderResponse, ViewOrderResponse } from '../../commons/dtos/orders/index.js';
import type { SystemError } from '../../commons/dtos/errors/SystemError.js';

export interface OrderDriver {
    placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>>;
    cancelOrder(orderNumber: string): Promise<Result<void, SystemError>>;
    viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, SystemError>>;
}
