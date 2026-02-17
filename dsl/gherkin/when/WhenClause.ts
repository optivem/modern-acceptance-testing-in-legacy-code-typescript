import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { PlaceOrderBuilder } from './PlaceOrderBuilder.js';
import { CancelOrderBuilder } from './CancelOrderBuilder.js';
import { ViewOrderBuilder } from './ViewOrderBuilder.js';
import { PublishCouponBuilder } from './PublishCouponBuilder.js';
import { BrowseCouponsBuilder } from './BrowseCouponsBuilder.js';

export class WhenClause {
    constructor(
        private readonly app: SystemDsl,
        private hasProduct: boolean = false,
        private hasTaxRate: boolean = false
    ) {}

    private async ensureDefaults(): Promise<void> {
        if (!this.hasProduct) {
            await this.app
                .erp()
                .returnsProduct()
                .sku(GherkinDefaults.DEFAULT_SKU)
                .unitPrice(GherkinDefaults.DEFAULT_UNIT_PRICE)
                .execute()
                .then((r) => r.shouldSucceed());
            this.hasProduct = true;
        }
        if (!this.hasTaxRate) {
            await this.app
                .tax()
                .returnsTaxRate()
                .country(GherkinDefaults.DEFAULT_COUNTRY)
                .taxRate(GherkinDefaults.DEFAULT_TAX_RATE)
                .execute()
                .then((r) => r.shouldSucceed());
            this.hasTaxRate = true;
        }
    }

    async placeOrder(): Promise<PlaceOrderBuilder> {
        await this.ensureDefaults();
        return new PlaceOrderBuilder(this.app);
    }

    async cancelOrder(): Promise<CancelOrderBuilder> {
        await this.ensureDefaults();
        return new CancelOrderBuilder(this.app);
    }

    async viewOrder(): Promise<ViewOrderBuilder> {
        await this.ensureDefaults();
        return new ViewOrderBuilder(this.app);
    }

    publishCoupon(): PublishCouponBuilder {
        return new PublishCouponBuilder(this.app);
    }

    browseCoupons(): BrowseCouponsBuilder {
        return new BrowseCouponsBuilder(this.app);
    }
}
