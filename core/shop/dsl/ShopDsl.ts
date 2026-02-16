import { UseCaseContext } from '@optivem/commons/dsl';
import { Closer } from '@optivem/commons/util';
import { ChannelContext } from '@optivem/optivem-testing';
import { ChannelType } from '../ChannelType.js';
import { ShopDriver } from '../driver/ShopDriver.js';
import { ShopApiDriver } from '../driver/api/ShopApiDriver.js';
import { ShopUiDriver } from '../driver/ui/ShopUiDriver.js';
import { GoToShop } from './commands/GoToShop.js';
import { PlaceOrder } from './commands/PlaceOrder.js';
import { CancelOrder } from './commands/CancelOrder.js';
import { ViewOrder } from './commands/ViewOrder.js';
import { PublishCoupon } from './commands/PublishCoupon.js';
import { BrowseCoupons } from './commands/BrowseCoupons.js';

export class ShopDsl {
    private readonly driver: ShopDriver;
    private readonly context: UseCaseContext;

    constructor(uiBaseUrl: string, apiBaseUrl: string, context: UseCaseContext) {
        this.driver = this.createDriver(uiBaseUrl, apiBaseUrl);
        this.context = context;
    }

    private createDriver(uiBaseUrl: string, apiBaseUrl: string): ShopDriver {
        const channel = ChannelContext.get();
        if (channel === ChannelType.UI) {
            return new ShopUiDriver(uiBaseUrl);
        } else if (channel === ChannelType.API) {
            return new ShopApiDriver(apiBaseUrl);
        } else {
            throw new Error(`Unknown channel: ${channel}`);
        }
    }

    async close(): Promise<void> {
        await Closer.close(this.driver);
    }

    goToShop(): GoToShop {
        return new GoToShop(this.driver, this.context);
    }

    placeOrder(): PlaceOrder {
        return new PlaceOrder(this.driver, this.context);
    }

    cancelOrder(): CancelOrder {
        return new CancelOrder(this.driver, this.context);
    }

    viewOrder(): ViewOrder {
        return new ViewOrder(this.driver, this.context);
    }

    publishCoupon(): PublishCoupon {
        return new PublishCoupon(this.driver, this.context);
    }

    browseCoupons(): BrowseCoupons {
        return new BrowseCoupons(this.driver, this.context);
    }
}


