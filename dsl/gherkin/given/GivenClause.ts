import type { SystemDsl } from '../../system/SystemDsl.js';
import { WhenClause } from '../when/WhenClause.js';
import { GivenProductBuilder } from './GivenProductBuilder.js';
import { GivenOrderBuilder } from './GivenOrderBuilder.js';
import { GivenClockBuilder } from './GivenClockBuilder.js';
import { GivenCountryBuilder } from './GivenCountryBuilder.js';
import { GivenCouponBuilder } from './GivenCouponBuilder.js';

/**
 * Given clause for Gherkin scenarios. Mirrors Java GivenClause and .NET GivenClause.
 * Constructor and method order aligned with reference (app, products, orders, clock, countries, coupons).
 */
export class GivenClause {
    private readonly app: SystemDsl;
    private readonly products: GivenProductBuilder[];
    private readonly orders: GivenOrderBuilder[];
    private clockBuilder: GivenClockBuilder;
    private readonly countries: GivenCountryBuilder[];
    private readonly coupons: GivenCouponBuilder[];

    constructor(app: SystemDsl) {
        this.app = app;
        this.products = [];
        this.orders = [];
        this.clockBuilder = new GivenClockBuilder(this);
        this.countries = [];
        this.coupons = [];
    }

    product(): GivenProductBuilder {
        const productBuilder = new GivenProductBuilder(this);
        this.products.push(productBuilder);
        return productBuilder;
    }

    order(): GivenOrderBuilder {
        const orderBuilder = new GivenOrderBuilder(this);
        this.orders.push(orderBuilder);
        return orderBuilder;
    }

    clock(): GivenClockBuilder {
        this.clockBuilder = new GivenClockBuilder(this);
        return this.clockBuilder;
    }

    country(): GivenCountryBuilder {
        const taxRateBuilder = new GivenCountryBuilder(this);
        this.countries.push(taxRateBuilder);
        return taxRateBuilder;
    }

    coupon(): GivenCouponBuilder {
        const couponBuilder = new GivenCouponBuilder(this);
        this.coupons.push(couponBuilder);
        return couponBuilder;
    }

    async when(): Promise<WhenClause> {
        await this.setupClock();
        await this.setupErp();
        await this.setupTax();
        await this.setupShop();
        return new WhenClause(this.app, this.products.length > 0, this.countries.length > 0);
    }

    private async setupClock(): Promise<void> {
        await this.clockBuilder.execute(this.app);
    }

    private async setupErp(): Promise<void> {
        if (this.orders.length > 0 && this.products.length === 0) {
            const defaultProduct = new GivenProductBuilder(this);
            this.products.push(defaultProduct);
        }
        for (const product of this.products) {
            await product.execute(this.app);
        }
    }

    private async setupTax(): Promise<void> {
        if (this.orders.length > 0 && this.countries.length === 0) {
            const defaultCountry = new GivenCountryBuilder(this);
            this.countries.push(defaultCountry);
        }
        for (const country of this.countries) {
            await country.execute(this.app);
        }
    }

    private async setupShop(): Promise<void> {
        await this.setupCoupons();
        await this.setupOrders();
    }

    private async setupCoupons(): Promise<void> {
        if (this.orders.length > 0 && this.coupons.length === 0) {
            const defaultCoupon = new GivenCouponBuilder(this);
            this.coupons.push(defaultCoupon);
        }
        for (const coupon of this.coupons) {
            await coupon.execute(this.app);
        }
    }

    private async setupOrders(): Promise<void> {
        for (const order of this.orders) {
            await order.execute(this.app);
        }
    }
}
