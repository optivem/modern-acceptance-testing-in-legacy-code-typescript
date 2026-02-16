import type { Result } from '@optivem/commons/util';
import type { BrowseCouponsResponse, PublishCouponRequest } from '../../commons/dtos/coupons/index.js';
import type { SystemError } from '../../commons/dtos/errors/SystemError.js';

export interface CouponDriver {
    publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>>;
    browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>>;
}
