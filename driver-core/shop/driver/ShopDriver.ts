import type { Result } from '@optivem/common/util';
import type { AsyncCloseable } from '@optivem/common/util';
import type { Optional } from '@optivem/common/util';
import type { SystemError } from '@optivem/driver-api/shop/dtos/errors/SystemError.js';
import type { PlaceOrderRequest } from '@optivem/driver-api/shop/dtos/PlaceOrderRequest.js';
import type { PlaceOrderResponse } from '@optivem/driver-api/shop/dtos/PlaceOrderResponse.js';
import type { ViewOrderResponse } from '@optivem/driver-api/shop/dtos/ViewOrderResponse.js';
import type { PublishCouponRequest } from '@optivem/driver-api/shop/dtos/PublishCouponRequest.js';
import type { BrowseCouponsResponse } from '@optivem/driver-api/shop/dtos/BrowseCouponsResponse.js';

export interface ShopDriver extends AsyncCloseable {
    goToShop(): Promise<Result<void, SystemError>>;
    placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>>;
    cancelOrder(orderNumber: Optional<string>): Promise<Result<void, SystemError>>;
    viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, SystemError>>;
    publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>>;
    browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>>;
}

