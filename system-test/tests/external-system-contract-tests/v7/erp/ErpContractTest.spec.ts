/**
 * V7 ERP Contract Test. Migrated from Java BaseErpContractTest.
 * Runs for both STUB and REAL external system modes.
 */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('ERP Contract Tests', () => {
    test('should be able to get product', async ({ app }) => {
        (await app.erp().returnsProduct()
            .sku('SKU-123')
            .unitPrice(12.0)
            .execute())
            .shouldSucceed();

        (await app.erp().getProduct()
            .sku('SKU-123')
            .execute())
            .shouldSucceed()
            .sku('SKU-123')
            .price(12.0);
    });
});
