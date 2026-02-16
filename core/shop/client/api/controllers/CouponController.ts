import type { JsonHttpClient } from '@optivem/commons/http';
import type { Result } from '@optivem/commons/util';
import type { ProblemDetailsResponse } from '../../dtos/errors/ProblemDetailsResponse.js';
import type { BrowseCouponsResponse, PublishCouponRequest } from '../../../commons/dtos/coupons/index.js';

export class CouponController {
    private static readonly ENDPOINT = '/api/coupons';

    constructor(private readonly httpClient: JsonHttpClient<ProblemDetailsResponse>) {}

    publishCoupon(request: PublishCouponRequest): Promise<Result<void, ProblemDetailsResponse>> {
        return this.httpClient.postAsync<void>(CouponController.ENDPOINT, request);
    }

    browseCoupons(): Promise<Result<BrowseCouponsResponse, ProblemDetailsResponse>> {
        return this.httpClient.getAsync<BrowseCouponsResponse>(CouponController.ENDPOINT);
    }
}
