import { test as base, expect } from '@playwright/test';
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

    async shouldBeAbleToGoToShop() {
        const result = await this.shopDriver.goToShop();
        expect(result.isSuccess()).toBe(true);
    }
}
