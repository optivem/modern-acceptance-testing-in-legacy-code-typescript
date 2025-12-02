import { test, expect } from './fixtures.js';

export { test };

export function createSmokeTests() {
    test('should be able to go to shop', async ({ shopDriver }) => {
        const result = await shopDriver.goToShop();
        expect(result.isSuccess()).toBe(true);
    });
}
