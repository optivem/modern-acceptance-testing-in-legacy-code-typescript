import type { JsonHttpClient } from '@optivem/commons/http';
import type { Result } from '@optivem/commons/util';
import type { ProblemDetailResponse } from '../dtos/errors/ProblemDetailResponse.js';
import type { BrowseCouponsResponse, PublishCouponRequest } from '../../../commons/dtos/coupons/index.js';

export class CouponController {
    private static readonly ENDPOINT = '/api/coupons';

    constructor(private readonly httpClient: JsonHttpClient<ProblemDetailResponse>) {}

    publishCoupon(request: PublishCouponRequest): Promise<Result<void, ProblemDetailResponse>> {
        return this.httpClient.postAsync<void>(CouponController.ENDPOINT, request);
    }

    browseCoupons(): Promise<Result<BrowseCouponsResponse, ProblemDetailResponse>> {
        return this.httpClient.getAsync<BrowseCouponsResponse>(CouponController.ENDPOINT);
    }
}
