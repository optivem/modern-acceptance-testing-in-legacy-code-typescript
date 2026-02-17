import type { Optional } from '@optivem/commons/util';

export class ExecutionResultContext {
    constructor(
        private readonly orderNumber: Optional<string>,
        private readonly couponCode: Optional<string>
    ) {}

    getOrderNumber(): Optional<string> {
        return this.orderNumber;
    }

    getCouponCode(): Optional<string> {
        return this.couponCode;
    }
}
