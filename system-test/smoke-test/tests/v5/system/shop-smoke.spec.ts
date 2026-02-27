/**
 * V5 smoke test: SystemDsl shop; one test per channel (UI/API).
 */
import '../../../../setup-config.js';
import { test, withChannels } from '../fixtures.js';
import { ChannelType } from '@optivem/dsl-core/system/shop/ChannelType.js';

test.describe('V5 Shop Smoke Tests', () => {
    withChannels(ChannelType.UI, ChannelType.API)(() => {
        test('should be able to go to shop', async ({ app }) => {
            (await app.shop().goToShop()
                .execute())
                .shouldSucceed();
        });
    });
});
