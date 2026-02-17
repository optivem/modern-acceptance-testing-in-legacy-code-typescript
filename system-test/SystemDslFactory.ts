import type { ExternalSystemMode } from '@optivem/commons/dsl';
import { SystemDsl } from '../dsl/system/SystemDsl.js';
import { SystemConfigurationLoader } from './SystemConfigurationLoader.js';

export class SystemDslFactory {
  static create(externalSystemMode: ExternalSystemMode): SystemDsl {
    const configuration = SystemConfigurationLoader.load(externalSystemMode);
    return new SystemDsl(configuration);
  }
}


