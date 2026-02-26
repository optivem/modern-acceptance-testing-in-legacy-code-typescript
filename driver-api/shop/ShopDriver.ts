import { Result } from '@optivem/common/util';
import type { AsyncCloseable } from '@optivem/common/util';
import type { Optional } from '@optivem/common/util';
import type { BrowseCouponsResponse } from './dtos/BrowseCouponsResponse.js';
import type { PlaceOrderRequest } from './dtos/PlaceOrderRequest.js';
import type { PlaceOrderResponse } from './dtos/PlaceOrderResponse.js';
import type { PublishCouponRequest } from './dtos/PublishCouponRequest.js';
import type { ViewOrderResponse } from './dtos/ViewOrderResponse.js';
import type { SystemError } from './dtos/errors/SystemError.js';

export interface ShopDriver extends AsyncCloseable {
	goToShop(): Promise<Result<void, SystemError>>;
	placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>>;
	cancelOrder(orderNumber: Optional<string>): Promise<Result<void, SystemError>>;
	viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, SystemError>>;
	publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>>;
	browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>>;
}
