import { describe, beforeEach, afterEach } from '@jest/globals';
import { DriverFactory } from '../../core/drivers/DriverFactory.js';
import { defineShopSmokeTests } from './shop-smoke-tests.js';
import { Closer } from '../../core/drivers/commons/clients/Closer.js';
import { ShopDriver } from '../../core/drivers/system/ShopDriver.js';

describe('API Smoke Tests', () => {
    let shopDriver: ShopDriver;

    beforeEach(() => {
        shopDriver = DriverFactory.createShopApiDriver();
    });

    afterEach(async () => {
        await Closer.close(shopDriver);
    });

    defineShopSmokeTests(() => shopDriver);
});
