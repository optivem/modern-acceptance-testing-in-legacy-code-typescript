import { createScenarioChannelFixtures as sharedCreate } from '@optivem/optivem-testing';
import type { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import { getDefaultExternalSystemMode } from '../driver/configurationLoaderRegistry.js';
import { SystemDslFactory } from '../system/SystemDslFactory.js';

export type { ScenarioChannelFixtures } from '@optivem/optivem-testing';

export function createScenarioChannelFixtures<TScenario>(options: {
    createScenario: (app: SystemDsl) => TScenario;
}) {
    return sharedCreate<SystemDsl, TScenario>({
        createApp: () => SystemDslFactory.create(getDefaultExternalSystemMode()),
        closeApp: (app: SystemDsl) => app.close(),
        createScenario: options.createScenario,
    });
}
