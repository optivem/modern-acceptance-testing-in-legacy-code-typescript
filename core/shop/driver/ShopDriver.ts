import type { Result } from '@optivem/commons/util';
import type { AsyncCloseable } from '@optivem/commons/util';
import type { SystemError } from '../commons/dtos/errors/SystemError.js';
import type { OrderDriver } from './internal/OrderDriver.js';
import type { CouponDriver } from './internal/CouponDriver.js';

export interface ShopDriver extends AsyncCloseable {
    goToShop(): Promise<Result<void, SystemError>>;
    orders(): OrderDriver;
    coupons(): CouponDriver;
}
