import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { GoToShopBuilder } from './GoToShopBuilder.js';
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
            try {
                await this.app
                    .erp()
                    .returnsProduct()
                    .sku(GherkinDefaults.DEFAULT_SKU)
                    .unitPrice(GherkinDefaults.DEFAULT_UNIT_PRICE)
                    .execute()
                    .then((r) => r.shouldSucceed());
            } catch (e) {
                // Ignore "already exists" errors (duplicate id from re-entrant calls)
                if (!String(e).includes('duplicate') && !String(e).includes('Insert failed')) throw e;
            }
            this.hasProduct = true;
        }
        if (!this.hasTaxRate) {
            try {
                await this.app
                    .tax()
                    .returnsTaxRate()
                    .country(GherkinDefaults.DEFAULT_COUNTRY)
                    .taxRate(GherkinDefaults.DEFAULT_TAX_RATE)
                    .execute()
                    .then((r) => r.shouldSucceed());
            } catch (e) {
                if (!String(e).includes('duplicate') && !String(e).includes('Insert failed')) throw e;
            }
            this.hasTaxRate = true;
        }
    }

    goToShop(): GoToShopBuilder {
        return new GoToShopBuilder(this.app);
    }

    placeOrder(): PlaceOrderBuilder {
        return new PlaceOrderBuilder(this.app, () => this.ensureDefaults());
    }

    cancelOrder(): CancelOrderBuilder {
        return new CancelOrderBuilder(this.app, () => this.ensureDefaults());
    }

    viewOrder(): ViewOrderBuilder {
        return new ViewOrderBuilder(this.app, () => this.ensureDefaults());
    }

    publishCoupon(): PublishCouponBuilder {
        return new PublishCouponBuilder(this.app);
    }

    browseCoupons(): BrowseCouponsBuilder {
        return new BrowseCouponsBuilder(this.app);
    }
}
