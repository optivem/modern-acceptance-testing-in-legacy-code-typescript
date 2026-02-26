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
} from './driver/configurationLoaderRegistry.js';
export {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
} from './driver/createDrivers.js';
export { shopChannelTest, shopChannelTestEach, channelTest } from './shopChannelTest.js';
export type { ShopFixtures } from './shopChannelTest.js';
