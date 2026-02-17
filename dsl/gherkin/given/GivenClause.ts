import type { SystemDsl } from '../../system/SystemDsl.js';
import type { WhenClause } from '../when/WhenClause.js';
import { GivenProductBuilder } from './GivenProductBuilder.js';
import { GivenOrderBuilder } from './GivenOrderBuilder.js';
import { GivenClockBuilder } from './GivenClockBuilder.js';
import { GivenCountryBuilder } from './GivenCountryBuilder.js';
import { GivenCouponBuilder } from './GivenCouponBuilder.js';

export class GivenClause {
    private readonly products: GivenProductBuilder[] = [];
    private readonly orders: GivenOrderBuilder[] = [];
    private clock: GivenClockBuilder;
    private readonly countries: GivenCountryBuilder[] = [];
    private readonly coupons: GivenCouponBuilder[] = [];

    constructor(private readonly app: SystemDsl) {
        this.clock = new GivenClockBuilder(this);
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
        this.clock = new GivenClockBuilder(this);
        return this.clock;
    }

    country(): GivenCountryBuilder {
        const countryBuilder = new GivenCountryBuilder(this);
        this.countries.push(countryBuilder);
        return countryBuilder;
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
        await this.clock.execute(this.app);
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
