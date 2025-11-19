import { TestHttpClient } from '../../commons/TestHttpClient';
import { HomeController } from './controllers/HomeController';

export class TaxApiClient {
  private readonly testHttpClient: TestHttpClient;
  private readonly homeController: HomeController;

  private constructor(
    testHttpClient: TestHttpClient,
    homeController: HomeController
  ) {
    this.testHttpClient = testHttpClient;
    this.homeController = homeController;
  }

  static async create(baseUrl: string): Promise<TaxApiClient> {
    const testHttpClient = new TestHttpClient(baseUrl);
    const homeController = new HomeController(testHttpClient);
    
    return new TaxApiClient(testHttpClient, homeController);
  }

  home(): HomeController {
    return this.homeController;
  }

  async close(): Promise<void> {
    // No cleanup needed for axios
  }
}
