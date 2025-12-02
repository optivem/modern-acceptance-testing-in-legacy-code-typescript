import { TestFixtures } from '../fixtures.js';
import { expect } from '@playwright/test';

export function defineShopSmokeTests(test: any) {
    test.describe('Shop Smoke Tests', () => {
        test('should be able to go to shop', async ({ shopDriver }: TestFixtures) => {
            const result = await shopDriver.goToShop();
            expect(result.isSuccess()).toBe(true);
        });
    });
}
