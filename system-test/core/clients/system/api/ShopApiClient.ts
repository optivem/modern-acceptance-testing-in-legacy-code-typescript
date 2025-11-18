import { APIRequestContext, request as playwrightRequest } from '@playwright/test';
import { TestHttpClient } from '../../commons/TestHttpClient';
import { EchoController } from './controllers/EchoController';
import { OrderController } from './controllers/OrderController';

export class ShopApiClient {
  private readonly requestContext: APIRequestContext | null = null;
  private readonly testHttpClient: TestHttpClient;
  private readonly echoController: EchoController;
  private readonly orderController: OrderController;

  private constructor(
    requestContext: APIRequestContext,
    testHttpClient: TestHttpClient,
    echoController: EchoController,
    orderController: OrderController
  ) {
    this.requestContext = requestContext;
    this.testHttpClient = testHttpClient;
    this.echoController = echoController;
    this.orderController = orderController;
  }

  static async create(baseUrl: string): Promise<ShopApiClient> {
    const requestContext = await playwrightRequest.newContext();
    const testHttpClient = new TestHttpClient(requestContext, baseUrl);
    const echoController = new EchoController(testHttpClient);
    const orderController = new OrderController(testHttpClient);
    
    return new ShopApiClient(requestContext, testHttpClient, echoController, orderController);
  }

  echo(): EchoController {
    return this.echoController;
  }

  orders(): OrderController {
    return this.orderController;
  }

  async close(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
    }
  }
}
