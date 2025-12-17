import { expect } from '@playwright/test';
import { setupResultMatchers } from '@optivem/testing-assertions';
import { shopChannelTest as channelTest, ShopFixtures } from '../../../core/shopChannelTest.js';
import { ChannelType } from '../../../core/shop/ChannelType.js';

setupResultMatchers();

channelTest([ChannelType.UI, ChannelType.API], 'should be able to go to shop', async ({ shopDriver }) => {
    const result = await shopDriver.goToShop();
    expect(result).toBeSuccess();
});


