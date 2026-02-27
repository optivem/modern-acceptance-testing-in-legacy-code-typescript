import type { ExternalSystemMode } from '@optivem/dsl-common/dsl';
import { SystemConfiguration } from '@optivem/dsl-core/system/SystemConfiguration.js';
import { SystemDsl } from '@optivem/dsl-core/system/SystemDsl.js';
import { getConfiguration } from '../driver/configurationLoaderRegistry.js';

export class SystemDslFactory {
    static create(externalSystemMode: ExternalSystemMode): SystemDsl {
        const configuration = getConfiguration(externalSystemMode);
        const systemConfiguration = new SystemConfiguration(
            configuration.shopUiBaseUrl,
            configuration.shopApiBaseUrl,
            configuration.erpBaseUrl,
            configuration.taxBaseUrl,
            configuration.clockBaseUrl,
            configuration.externalSystemMode
        );
        return new SystemDsl(systemConfiguration);
    }
}