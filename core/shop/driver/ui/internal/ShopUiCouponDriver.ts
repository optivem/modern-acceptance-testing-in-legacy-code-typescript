import type { Result } from '@optivem/commons/util';
import type { CouponDriver } from '../../internal/CouponDriver.js';
import type { BrowseCouponsResponse, PublishCouponRequest } from '../../../commons/dtos/coupons/index.js';
import type { SystemError } from '../../../commons/dtos/errors/SystemError.js';
import { success } from '../../../commons/SystemResults.js';
import type { HomePage } from '../../../client/ui/pages/HomePage.js';
import { Page, type PageNavigator } from './PageNavigator.js';
import { CouponManagementPage } from '../../../client/ui/pages/CouponManagementPage.js';

export class ShopUiCouponDriver implements CouponDriver {
    private couponManagementPage?: CouponManagementPage;

    constructor(
        private readonly homePageSupplier: () => Promise<HomePage>,
        private readonly pageNavigator: PageNavigator
    ) {}

    async publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>> {
        await this.ensureOnCouponManagementPage();
        const page = this.couponManagementPage!;
        await page.inputCouponCode(request.code);
        await page.inputDiscountRate(request.discountRate);
        await page.inputValidFrom(request.validFrom);
        await page.inputValidTo(request.validTo);
        await page.inputUsageLimit(request.usageLimit);
        await page.clickPublishCoupon();
        return page.getResult().then((r: import('@optivem/commons/util').Result<string, SystemError>) => r.mapVoid());
    }

    async browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>> {
        await this.navigateToCouponManagementPage();
        const coupons = await this.couponManagementPage!.readCoupons();
        return success({ coupons });
    }

    private async ensureOnCouponManagementPage(): Promise<void> {
        if (this.pageNavigator.getCurrentPage() !== Page.COUPON_MANAGEMENT) {
            await this.navigateToCouponManagementPage();
        }
    }

    private async navigateToCouponManagementPage(): Promise<void> {
        const homePage = await this.homePageSupplier();
        this.couponManagementPage = await homePage.clickCouponManagement();
        this.pageNavigator.setCurrentPage(Page.COUPON_MANAGEMENT);
    }
}
