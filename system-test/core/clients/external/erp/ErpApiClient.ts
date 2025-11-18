import { TestHttpClient } from '../../commons/TestHttpClient';
import { ProductController } from './controllers/ProductController';

export class ErpApiClient {
  private readonly testHttpClient: TestHttpClient;
  private readonly productController: ProductController;

  private constructor(
    testHttpClient: TestHttpClient,
    productController: ProductController
  ) {
    this.testHttpClient = testHttpClient;
    this.productController = productController;
  }

  static async create(baseUrl: string): Promise<ErpApiClient> {
    const testHttpClient = new TestHttpClient(baseUrl);
    const productController = new ProductController(testHttpClient);
    
    return new ErpApiClient(testHttpClient, productController);
  }

  products(): ProductController {
    return this.productController;
  }

  async close(): Promise<void> {
    // No cleanup needed for axios
  }
}
