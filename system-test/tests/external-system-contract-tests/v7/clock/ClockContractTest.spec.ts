/**
 * V7 Clock Contract Test. Migrated from Java BaseClockContractTest.
 * Runs for both STUB and REAL external system modes.
 */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';

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
});
