/**
 * V7 Tax Contract Test. Migrated from Java BaseTaxContractTest.
 * Runs for both STUB and REAL external system modes.
 */
import '../../../../setup-config.js';
import { test } from '../base/fixtures.js';

test.describe('Tax Contract Tests', () => {
    test('should be able to get tax rate', async ({ app }) => {
        (await app.tax().returnsTaxRate()
            .country('US')
            .taxRate(0.09)
            .execute())
            .shouldSucceed();

        (await app.tax().getTaxRate()
            .country('US')
            .execute())
            .shouldSucceed()
            .country('US')
            .taxRateIsPositive();
    });
});
