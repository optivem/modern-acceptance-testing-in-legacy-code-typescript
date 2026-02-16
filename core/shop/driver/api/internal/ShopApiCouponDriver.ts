import type { ShopApiClient } from '../../../client/api/ShopApiClient.js';
import type { CouponDriver } from '../../internal/CouponDriver.js';
import type {
    BrowseCouponsResponse,
    PublishCouponRequest,
} from '../../../commons/dtos/coupons/index.js';
import type { SystemError } from '../../../commons/dtos/errors/SystemError.js';
import { systemErrorFrom } from '../../../commons/dtos/errors/SystemError.js';
import type { Result } from '@optivem/commons/util';

export class ShopApiCouponDriver implements CouponDriver {
    constructor(private readonly apiClient: ShopApiClient) {}

    publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>> {
        return this.apiClient.coupons()
            .publishCoupon(request)
            .then((r) => r.mapError((e) => systemErrorFrom(e)));
    }

    browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>> {
        return this.apiClient
            .coupons()
            .browseCoupons()
            .then((r) => r.mapError((e) => systemErrorFrom(e)));
    }
}
