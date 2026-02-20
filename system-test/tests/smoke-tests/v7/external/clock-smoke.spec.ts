/** V7 smoke test: SystemDsl clock. */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V7 External – Clock', () => {
    test('should be able to go to clock', async ({ app }) => {
        (await app.clock().goToClock()
            .execute())
            .shouldSucceed();
    });
});
