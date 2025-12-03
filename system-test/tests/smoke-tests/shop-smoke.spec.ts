import { test as base, expect } from '@playwright/test';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { Closer } from '../../core/drivers/commons/clients/Closer.js';
import { setupResultMatchers } from '../../core/matchers/resultMatchers.js';

setupResultMatchers();

// Channel configuration similar to .NET's [ChannelData(ChannelType.UI, ChannelType.API)]
const channels = [
    { 
        name: 'API', 
        createDriver: () => DriverFactory.createShopApiDriver() 
    },
    { 
        name: 'UI', 
        createDriver: () => DriverFactory.createShopUiDriver() 
    }
];

// Parameterized tests - single test definition runs against both channels
for (const channel of channels) {
    base.describe(`[${channel.name} Channel]`, () => {
        let shopDriver: any;

        base.afterEach(async () => {
            await Closer.close(shopDriver);
        });

        base('should be able to go to shop', async () => {
            shopDriver = channel.createDriver();
            const result = await shopDriver.goToShop();
            expect(result).toBeSuccess();
        });
    });
}
