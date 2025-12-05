import { AxiosInstance } from 'axios';
import { HttpGateway } from '../../../../commons/clients/HttpGateway.js';
import { HealthController } from './controllers/HealthController.js';
import { OrderController } from './controllers/OrderController.js';

export class ShopApiClient {
    private readonly httpClient: AxiosInstance;
    private readonly testHttpClient: HttpGateway;
    public readonly health: HealthController;
    public readonly order: OrderController;

    constructor(client: AxiosInstance, baseUrl: string) {
        this.httpClient = client;
        this.testHttpClient = new HttpGateway(client, baseUrl);
        this.health = new HealthController(this.testHttpClient);
        this.order = new OrderController(this.testHttpClient);
    }
}
