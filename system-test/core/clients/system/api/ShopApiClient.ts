import { TestHttpClient } from '../../commons/TestHttpClient';
import { EchoController } from './controllers/EchoController';
import { OrderController } from './controllers/OrderController';

export class ShopApiClient {
  private readonly testHttpClient: TestHttpClient;
  private readonly echoController: EchoController;
  private readonly orderController: OrderController;

  private constructor(
    testHttpClient: TestHttpClient,
    echoController: EchoController,
    orderController: OrderController
  ) {
    this.testHttpClient = testHttpClient;
    this.echoController = echoController;
    this.orderController = orderController;
  }

  static async create(baseUrl: string): Promise<ShopApiClient> {
    const testHttpClient = new TestHttpClient(baseUrl);
    const echoController = new EchoController(testHttpClient);
    const orderController = new OrderController(testHttpClient);
    
    return new ShopApiClient(testHttpClient, echoController, orderController);
  }

  echo(): EchoController {
    return this.echoController;
  }

  orders(): OrderController {
    return this.orderController;
  }

  async close(): Promise<void> {
    // No cleanup needed for axios
  }
}
