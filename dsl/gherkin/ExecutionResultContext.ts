export class ExecutionResultContext {
    constructor(
        private readonly orderNumber: string,
        private readonly couponCode: string
    ) {}

    getOrderNumber(): string {
        return this.orderNumber;
    }

    getCouponCode(): string {
        return this.couponCode;
    }
}
