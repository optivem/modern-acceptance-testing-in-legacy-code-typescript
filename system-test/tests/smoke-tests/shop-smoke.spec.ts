import { expect } from '@playwright/test';
import { setupResultMatchers } from '../../core/matchers/resultMatchers.js';
import { ChannelType, channelTest } from '../../core/channels/index.js';

setupResultMatchers();

// @Channel(UI, API) - TypeScript equivalent using helper function
channelTest([ChannelType.UI, ChannelType.API], 'should be able to go to shop', async ({ shopDriver }) => {
    const result = await shopDriver.goToShop();
    expect(result).toBeSuccess();
});
