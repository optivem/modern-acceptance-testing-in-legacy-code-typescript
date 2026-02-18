/**
 * V3 smoke test: shop UI driver (driver layer). Extends ShopBaseSmokeTest like Java/.NET.
 */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';
import { ShopUiSmokeTest } from './ShopBaseSmokeTest.js';

test.describe('V3 Shop UI Smoke Tests', () => {
    test('should be able to go to shop', async ({ shopUiDriver }) => {
        const suite = new ShopUiSmokeTest(shopUiDriver);
        await suite.shouldBeAbleToGoToShop();
    });
});
