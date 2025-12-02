import { AxiosInstance } from 'axios';
import { TestHttpClient } from '../../../../commons/clients/TestHttpClient.js';
import { HealthController } from './controllers/HealthController.js';
import { OrderController } from './controllers/OrderController.js';

export class ShopApiClient {
    private readonly httpClient: TestHttpClient;
    public readonly health: HealthController;
    public readonly order: OrderController;

    constructor(client: AxiosInstance, baseUrl: string) {
        this.httpClient = new TestHttpClient(client, baseUrl);
        this.health = new HealthController(this.httpClient);
        this.order = new OrderController(this.httpClient);
    }
}
