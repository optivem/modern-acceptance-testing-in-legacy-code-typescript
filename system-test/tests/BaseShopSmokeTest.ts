import { test as base } from '@playwright/test';
import { ShopDriver } from '../core/drivers/system/ShopDriver.js';

export abstract class BaseShopSmokeTest {
    protected shopDriver!: ShopDriver;

    protected abstract createDriver(): ShopDriver;

    async setUp() {
        this.shopDriver = this.createDriver();
    }

    async tearDown() {
        if (this.shopDriver) {
            this.shopDriver.close();
        }
    }
}
