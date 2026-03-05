/**
 * V5 smoke test: AppDsl shop; one test per channel (UI/API).
 */
import '../../../../setup-config.js';
import { test, forChannels } from '../fixtures.js';
import { ChannelType } from '@optivem/dsl-core/app/shop/ChannelType.js';

test.describe('V5 Shop Smoke Tests', () => {
    forChannels(ChannelType.UI, ChannelType.API)(() => {
        test('should be able to go to shop', async ({ app }) => {
            (await app.shop().goToShop()
                .execute())
                .shouldSucceed();
        });
    });
});
