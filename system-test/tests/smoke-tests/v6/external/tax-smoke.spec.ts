/**
 * V6 smoke test: SystemDsl Tax (BaseSystemDslTest).
 */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V6 Tax Smoke Tests', () => {
    test('should be able to go to Tax', async ({ app }) => {
        (await app.tax().goToTax()
            .execute())
            .shouldSucceed();
    });
});
