import { SystemDsl } from '../core/SystemDsl.js';
import { SystemConfigurationLoader } from './SystemConfigurationLoader.js';

export class SystemDslFactory {
  static create(): SystemDsl {
    const configuration = SystemConfigurationLoader.load();
    return new SystemDsl(configuration);
  }
}
