/**
 * V5 smoke test: SystemDsl Tax.
 */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V5 Tax Smoke Tests', () => {
    test('should be able to go to Tax', async ({ app }) => {
        (await app.tax().goToTax()
            .execute())
            .shouldSucceed();
    });
});
