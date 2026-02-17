import { ExternalSystemMode } from '@optivem/commons/dsl';

export interface TestConfig {
  urls: {
    shopUi: string;
    shopApi: string;
    erpApi: string;
    taxApi: string;
  };
}

export const testConfig: TestConfig = {
  urls: {
    shopUi: process.env.SHOP_UI_BASE_URL || 'http://localhost:3001',
    shopApi: process.env.SHOP_API_BASE_URL || 'http://localhost:8081',
    erpApi: process.env.ERP_API_BASE_URL || 'http://localhost:9001/erp',
    taxApi: process.env.TAX_API_BASE_URL || 'http://localhost:9001/tax',
  },
};

/** Resolves external system mode from env (for tests that need to pass it into load/create). */
export function getExternalSystemMode(): ExternalSystemMode {
  return (process.env.EXTERNAL_SYSTEM_MODE?.toUpperCase() as 'STUB' | 'REAL') === 'STUB'
    ? ExternalSystemMode.STUB
    : ExternalSystemMode.REAL;
}


