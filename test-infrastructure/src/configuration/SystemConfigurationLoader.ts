import type { ExternalSystemMode } from '@optivem/commons/dsl';
import type { LoadedConfiguration } from './LoadedConfiguration.js';
import { Environment } from './Environment.js';
import { getTestConfig } from './test-configs.js';

/**
 * Loads test configuration by environment and external system mode (matches Java/.NET SystemConfigurationLoader).
 */
export function load(
    environment: Environment,
    externalSystemMode: ExternalSystemMode
): LoadedConfiguration {
    return getTestConfig(environment, externalSystemMode);
}
