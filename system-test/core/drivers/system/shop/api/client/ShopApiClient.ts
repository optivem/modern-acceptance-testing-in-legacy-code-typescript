import { AxiosInstance } from 'axios';
import { TestHttpClient } from '@optivem/http';
import { HealthController } from './controllers/HealthController.js';
import { OrderController } from './controllers/OrderController.js';

export class ShopApiClient {
    private readonly httpClient: AxiosInstance;
    private readonly testHttpClient: TestHttpClient;
    public readonly health: HealthController;
    public readonly order: OrderController;

    constructor(client: AxiosInstance, baseUrl: string) {
        this.httpClient = client;
        this.testHttpClient = new TestHttpClient(client, baseUrl);
        this.health = new HealthController(this.testHttpClient);
        this.order = new OrderController(this.testHttpClient);
    }
}
