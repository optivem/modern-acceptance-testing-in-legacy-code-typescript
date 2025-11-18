interface TestConfig {
  test: {
    eshop: {
      ui: {
        baseUrl: string;
      };
      api: {
        baseUrl: string;
      };
    };
    erp: {
      api: {
        baseUrl: string;
      };
    };
  };
}

export class TestConfiguration {
  private static config: TestConfig | null = null;

  private static loadConfig(): TestConfig {
    if (!this.config) {
      // Configuration values - these match the Playwright config
      this.config = {
        test: {
          eshop: {
            ui: {
              baseUrl: 'http://localhost:8082',
            },
            api: {
              baseUrl: 'http://localhost:8082/api',
            },
          },
          erp: {
            api: {
              baseUrl: 'http://localhost:3000',
            },
          },
        },
      };
    }
    return this.config;
  }

  static getShopUiBaseUrl(): string {
    return this.loadConfig().test.eshop.ui.baseUrl;
  }

  static getShopApiBaseUrl(): string {
    return this.loadConfig().test.eshop.api.baseUrl;
  }

  static getErpApiBaseUrl(): string {
    return this.loadConfig().test.erp.api.baseUrl;
  }
}
