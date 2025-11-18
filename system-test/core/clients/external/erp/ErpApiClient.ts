import { APIRequestContext, request as playwrightRequest } from '@playwright/test';
import { TestHttpClient } from '../../commons/TestHttpClient';
import { ProductController } from './controllers/ProductController';

export class ErpApiClient {
  private readonly requestContext: APIRequestContext | null = null;
  private readonly testHttpClient: TestHttpClient;
  private readonly productController: ProductController;

  private constructor(
    requestContext: APIRequestContext,
    testHttpClient: TestHttpClient,
    productController: ProductController
  ) {
    this.requestContext = requestContext;
    this.testHttpClient = testHttpClient;
    this.productController = productController;
  }

  static async create(baseUrl: string): Promise<ErpApiClient> {
    const requestContext = await playwrightRequest.newContext();
    const testHttpClient = new TestHttpClient(requestContext, baseUrl);
    const productController = new ProductController(testHttpClient);
    
    return new ErpApiClient(requestContext, testHttpClient, productController);
  }

  products(): ProductController {
    return this.productController;
  }

  async close(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
    }
  }
}
