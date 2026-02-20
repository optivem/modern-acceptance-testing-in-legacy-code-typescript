/**
 * V7 Clock Contract Tests. Migrated from Java BaseClockContractTest + ClockStubContractTest.
 * Runs for both STUB and REAL external system modes; stub-only tests are skipped for REAL.
 *
 * Serial mode prevents parallel workers from interfering via the shared stub clock endpoint.
 */
import '../../../../setup-config.js';
import { ExternalSystemMode } from '@optivem/commons/dsl';
import { test } from '../base/fixtures.js';
import { getExternalSystemMode } from '../../../../test.config.js';

// Serial: all clock tests share the same stub endpoint, so they must not run in parallel.
test.describe.configure({ mode: 'serial' });

test.describe('Clock Contract Tests', () => {
    test('should be able to get time', async ({ app }) => {
        (await app.clock().returnsTime()
            .time('2024-06-15T12:00:00Z')
            .execute())
            .shouldSucceed();

        (await app.clock().getTime()
            .execute())
            .shouldSucceed()
            .timeIsNotNull();
    });

    test.describe('Stub-only', () => {
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
});
