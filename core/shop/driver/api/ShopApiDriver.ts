import type { Result } from '@optivem/commons/util';
import type { ShopDriver } from '../ShopDriver.js';
import type { SystemError } from '../../commons/dtos/errors/SystemError.js';
import { ShopApiClient } from '../../client/api/ShopApiClient.js';
import { ShopApiOrderDriver } from './internal/ShopApiOrderDriver.js';
import { ShopApiCouponDriver } from './internal/ShopApiCouponDriver.js';
import { systemErrorFrom } from '../../commons/dtos/errors/SystemError.js';

export class ShopApiDriver implements ShopDriver {
    private readonly apiClient: ShopApiClient;
    private readonly orderDriver: ShopApiOrderDriver;
    private readonly couponDriver: ShopApiCouponDriver;

    constructor(baseUrl: string) {
        this.apiClient = new ShopApiClient(baseUrl);
        this.orderDriver = new ShopApiOrderDriver(this.apiClient);
        this.couponDriver = new ShopApiCouponDriver(this.apiClient);
    }
    
    async close(): Promise<void> {
        this.apiClient.close();
    }

    goToShop(): Promise<Result<void, SystemError>> {
        return this.apiClient.health().checkHealth().then((r) => r.mapError((e) => systemErrorFrom(e)));
    }

    orders(): ShopApiOrderDriver {
        return this.orderDriver;
    }

    coupons(): ShopApiCouponDriver {
        return this.couponDriver;
    }
}
