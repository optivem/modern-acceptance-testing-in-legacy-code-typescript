import { SystemConfiguration } from '../../SystemConfiguration.js';
import { Context } from '@optivem/commons/dsl';
import { ShopDriver } from '../driver/ShopDriver.js';
import { ShopApiDriver } from '../driver/api/ShopApiDriver.js';
import { ShopUiDriver } from '../driver/ui/ShopUiDriver.js';
import { ChannelType } from '../ChannelType.js';
import { ChannelContext } from '@optivem/optivem-testing';
import { Closer } from '@optivem/commons/util';
import { GoToShop } from './commands/GoToShop.js';
import { PlaceOrder } from './commands/PlaceOrder.js';
import { CancelOrder } from './commands/CancelOrder.js';
import { ViewOrder } from './commands/ViewOrder.js';

export class ShopDsl {
    private readonly driver: ShopDriver;
    private readonly context: Context;

    constructor(context: Context, configuration: SystemConfiguration) {
        this.driver = this.createDriver(configuration);
        this.context = context;
    }

    private createDriver(configuration: SystemConfiguration): ShopDriver {
        const channel = ChannelContext.get();
        if (channel === ChannelType.UI) {
            return new ShopUiDriver(configuration.getShopUiBaseUrl());
        } else if (channel === ChannelType.API) {
            return new ShopApiDriver(configuration.getShopApiBaseUrl());
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
}


