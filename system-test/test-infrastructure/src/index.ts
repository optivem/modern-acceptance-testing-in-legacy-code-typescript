export {
    Environment,
    type LoadedConfiguration,
    getEnvironment,
    getExternalSystemMode,
    load,
    BaseConfigurableTest,
} from './configuration/index.js';
export type {
    BaseRawTestFixture,
    BaseClientTestFixture,
    BaseDriverTestFixture,
    BaseChannelDriverTestFixture,
    BaseSystemDslTestFixture,
    BaseScenarioDslTestFixture,
    BaseScenarioDslTestFixtureV6,
} from './base/index.js';
export {
    setConfigurationLoader,
    getDefaultExternalSystemMode,
    getConfiguration,
} from './driver/configurationLoaderRegistry.js';
export {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
} from './driver/createDrivers.js';
export { shopChannelTest, shopChannelTestEach, channelTest } from './shopChannelTest.js';
export type { ShopFixtures } from './shopChannelTest.js';
export { SystemDslFactory } from './system/SystemDslFactory.js';
export { testConfig } from './configuration/legacyTestConfig.js';
