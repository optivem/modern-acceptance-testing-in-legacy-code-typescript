import type { ExternalSystemMode } from '@optivem/commons/dsl';
import { SystemDsl } from '../core/SystemDsl.js';
import { SystemConfigurationLoader } from './SystemConfigurationLoader.js';

export class SystemDslFactory {
  static create(externalSystemMode: ExternalSystemMode): SystemDsl {
    const configuration = SystemConfigurationLoader.load(externalSystemMode);
    return new SystemDsl(configuration);
  }
}


