import '../../setup-config.js';
import { expect } from '@playwright/test';
import { setupResultMatchers } from '@optivem/commons/util';
import { shopChannelTest as channelTest, type ShopFixtures } from '@optivem/test-infrastructure';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { getExternalSystemMode } from '../../test.config.js';

setupResultMatchers();

channelTest(getExternalSystemMode(), [ChannelType.UI, ChannelType.API], 'should be able to go to shop', async ({ shopDriver }) => {
    const result = await shopDriver.goToShop();
    expect(result).toBeSuccess();
});


