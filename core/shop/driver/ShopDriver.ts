import type { Result } from '@optivem/commons/util';
import type { AsyncCloseable } from '@optivem/commons/util';
import type { Optional } from '@optivem/commons/util';
import type { SystemError } from '../commons/dtos/errors/SystemError.js';
import type { PlaceOrderRequest, PlaceOrderResponse, ViewOrderResponse } from '../commons/dtos/orders/index.js';
import type { PublishCouponRequest, BrowseCouponsResponse } from '../commons/dtos/coupons/index.js';

export interface ShopDriver extends AsyncCloseable {
    goToShop(): Promise<Result<void, SystemError>>;
    placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>>;
    cancelOrder(orderNumber: Optional<string>): Promise<Result<void, SystemError>>;
    viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, SystemError>>;
    publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>>;
    browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>>;
}
