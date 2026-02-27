/**
 * Extends a Playwright test object with a `scenario` fixture derived from the `app` fixture.
 *
 * Usage:
 * ```typescript
 * const appTest = withApp();
 * const test = withScenario(appTest, (app) => new ScenarioDsl(app));
 * test('my test', async ({ scenario }) => { ... });
 * ```
 */
export function withScenario<TApp, TScenario>(
    appTest: any,
    createScenario: (app: TApp) => TScenario,
) {
    return appTest.extend({
        scenario: async ({ app }: { app: TApp }, use: (scenario: TScenario) => Promise<void>) => {
            const scenario = createScenario(app);
            await use(scenario);
        },
    });
}
