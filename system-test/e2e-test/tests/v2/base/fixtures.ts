import { randomUUID } from 'node:crypto';
import { test as base } from '@playwright/test';
import { ShopUiClient } from '@optivem/driver-core/shop/client/ui/ShopUiClient.js';
import { ShopApiClient } from '@optivem/driver-core/shop/client/api/ShopApiClient.js';
import { ErpRealClient } from '@optivem/driver-core/erp/client/ErpRealClient.js';
import { TaxRealClient } from '@optivem/driver-core/tax/client/TaxRealClient.js';
import { Closer, setupResultMatchers } from '@optivem/commons/util';
import { testConfig } from '@optivem/test-infrastructure';

setupResultMatchers();

export const test = base.extend<{
    shopUiClient: ShopUiClient;
    shopApiClient: ShopApiClient;
    erpClient: ErpRealClient;
    taxClient: TaxRealClient;
}>({
    shopUiClient: async ({}, use) => {
        const client = new ShopUiClient(testConfig.urls.shopUi);
        await use(client);
        await client.close();
    },
    shopApiClient: async ({}, use) => {
        const client = new ShopApiClient(testConfig.urls.shopApi);
        await use(client);
        client.close();
    },
    erpClient: async ({}, use) => {
        const client = new ErpRealClient(testConfig.urls.erpApi);
        await use(client);
        await Closer.close(client);
    },
    taxClient: async ({}, use) => {
        const client = new TaxRealClient(testConfig.urls.taxApi);
        await use(client);
        await Closer.close(client);
    },
});

export { expect } from '@playwright/test';

export function createUniqueSku(baseSku: string): string {
    const suffix = randomUUID().replace(/-/g, '').slice(0, 8);
    return `${baseSku}-${suffix}`;
}
