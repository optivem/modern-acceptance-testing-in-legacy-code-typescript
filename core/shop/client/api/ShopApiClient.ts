import { JsonHttpClient } from '@optivem/commons/http';
import type { ProblemDetailsResponse } from './dtos/errors/ProblemDetailsResponse.js';
import { HealthController } from './controllers/HealthController.js';
import { OrderController } from './controllers/OrderController.js';
import { CouponController } from './controllers/CouponController.js';

export class ShopApiClient {
    private readonly httpClient: JsonHttpClient<ProblemDetailsResponse>;
    private readonly healthController: HealthController;
    private readonly orderController: OrderController;
    private readonly couponController: CouponController;

    constructor(baseUrl: string) {
        this.httpClient = new JsonHttpClient<ProblemDetailsResponse>(baseUrl);
        this.healthController = new HealthController(this.httpClient);
        this.orderController = new OrderController(this.httpClient);
        this.couponController = new CouponController(this.httpClient);
    }

    health(): HealthController {
        return this.healthController;
    }

    orders(): OrderController {
        return this.orderController;
    }

    coupons(): CouponController {
        return this.couponController;
    }

    close(): void {
        // JsonHttpClient has no resources to release; no-op for API consistency with reference
    }
}
