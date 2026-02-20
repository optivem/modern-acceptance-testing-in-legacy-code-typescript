/**
 * V7 Tax Stub Contract Test. Migrated from Java TaxStubContractTest.
 * Stub-only: verifies that the stub returns the configured tax rate exactly.
 * Skipped when EXTERNAL_SYSTEM_MODE is not STUB.
 */
import '../../../../setup-config.js';
import { ExternalSystemMode } from '@optivem/commons/dsl';
import { test } from '../fixtures.js';
import { getExternalSystemMode } from '../../../../test.config.js';

test.describe('Tax Stub Contract Tests', () => {
    test.skip(
        () => getExternalSystemMode() !== ExternalSystemMode.STUB,
        'Stub-only tests — skipped when EXTERNAL_SYSTEM_MODE is not STUB'
    );

    test('should be able to get configured tax rate', async ({ app }) => {
        (await app.tax().returnsTaxRate()
            .country('LALA')
            .taxRate(0.23)
            .execute())
            .shouldSucceed();

        (await app.tax().getTaxRate()
            .country('LALA')
            .execute())
            .shouldSucceed()
            .country('LALA')
            .taxRate(0.23);
    });
});
