/**
 * V7 Clock Stub Contract Test. Migrated from Java ClockStubContractTest.
 * Stub-only: verifies that the stub returns the configured time exactly.
 * Skipped when EXTERNAL_SYSTEM_MODE is not STUB.
 */
import '../../../../setup-config.js';
import { ExternalSystemMode } from '@optivem/commons/dsl';
import { test } from '../fixtures.js';
import { getExternalSystemMode } from '../../../../test.config.js';

test.describe('Clock Stub Contract Tests', () => {
    test.skip(
        () => getExternalSystemMode() !== ExternalSystemMode.STUB,
        'Stub-only tests — skipped when EXTERNAL_SYSTEM_MODE is not STUB'
    );

    test('should be able to get configured time', async ({ app }) => {
        (await app.clock().returnsTime()
            .time('2024-01-02T09:00:00Z')
            .execute())
            .shouldSucceed();

        (await app.clock().getTime()
            .execute())
            .shouldSucceed()
            .time('2024-01-02T09:00:00Z');
    });
});
