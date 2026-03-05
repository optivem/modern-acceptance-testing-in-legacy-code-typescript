import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { AppConfiguration } from '@optivem/dsl-core/app/AppConfiguration.js';
import { AppDsl } from '@optivem/dsl-core/app/AppDsl.js';
import { getConfiguration } from '../driver/configurationLoaderRegistry.js';

export class SystemDslFactory {
    static create(externalSystemMode: ExternalSystemMode): AppDsl {
        const configuration = getConfiguration(externalSystemMode);
        const appConfiguration = new AppConfiguration(
            configuration.shopUiBaseUrl,
            configuration.shopApiBaseUrl,
            configuration.erpBaseUrl,
            configuration.taxBaseUrl,
            configuration.clockBaseUrl,
            configuration.externalSystemMode
        );
        return new AppDsl(appConfiguration);
    }
}
