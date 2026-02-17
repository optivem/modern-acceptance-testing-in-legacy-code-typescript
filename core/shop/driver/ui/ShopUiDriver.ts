import type { Result } from '@optivem/commons/util';
import type { ShopDriver } from '../ShopDriver.js';
import type { SystemError } from '../../commons/dtos/errors/SystemError.js';
import { ShopUiClient } from '../../client/ui/ShopUiClient.js';
import { HomePage } from '../../client/ui/pages/HomePage.js';
import { PageNavigator, Page } from './internal/PageNavigator.js';
import { ShopUiOrderDriver } from './internal/ShopUiOrderDriver.js';
import { ShopUiCouponDriver } from './internal/ShopUiCouponDriver.js';
import { failure, success } from '../../commons/SystemResults.js';

export class ShopUiDriver implements ShopDriver {
    private readonly client: ShopUiClient;
    private readonly pageNavigator: PageNavigator;
    private readonly orderDriver: ShopUiOrderDriver;
    private readonly couponDriver: ShopUiCouponDriver;
    private homePage: HomePage | null = null;

    constructor(baseUrl: string) {
        this.client = new ShopUiClient(baseUrl);
        this.pageNavigator = new PageNavigator();
        this.orderDriver = new ShopUiOrderDriver(() => this.getHomePage(), this.pageNavigator);
        this.couponDriver = new ShopUiCouponDriver(() => this.getHomePage(), this.pageNavigator);
    }

    async close(): Promise<void> {
        await this.client.close();
    }

    async goToShop(): Promise<Result<void, SystemError>> {
        this.homePage = await this.client.openHomePage();
        if (!this.client.isStatusOk() || !(await this.client.isPageLoaded())) {
            return failure('Failed to load home page');
        }
        this.pageNavigator.setCurrentPage(Page.HOME);
        return success();
    }

    orders(): ShopUiOrderDriver {
        return this.orderDriver;
    }

    coupons(): ShopUiCouponDriver {
        return this.couponDriver;
    }

    private async getHomePage(): Promise<HomePage> {
        if (this.homePage == null || !this.pageNavigator.isOnPage(Page.HOME)) {
            this.homePage = await this.client.openHomePage();
            this.pageNavigator.setCurrentPage(Page.HOME);
        }
        return this.homePage;
    }
}
