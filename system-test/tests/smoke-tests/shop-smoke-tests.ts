import { describe, test, expect } from '@jest/globals';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';

export function defineShopSmokeTests(getDriver: () => ShopDriver) {
    describe('Shop Smoke Tests', () => {
        test('should be able to go to shop', async () => {
            const shopDriver = getDriver();
            const result = await shopDriver.goToShop();
            expect(result.isSuccess()).toBe(true);
        });
    });
}
