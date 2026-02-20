/**
 * V6 smoke test: SystemDsl ERP (BaseSystemDslTest).
 */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V6 ERP Smoke Tests', () => {
    test('should be able to go to ERP', async ({ app }) => {
        (await app.erp().goToErp()
            .execute())
            .shouldSucceed();
    });
});
