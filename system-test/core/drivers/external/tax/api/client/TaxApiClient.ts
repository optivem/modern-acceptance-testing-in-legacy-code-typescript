import { AxiosInstance } from 'axios';
import { TestHttpClient } from '../../../../commons/clients/TestHttpClient.js';
import { HealthController } from './controllers/HealthController.js';

export class TaxApiClient {
    private readonly httpClient: AxiosInstance;
    private readonly testHttpClient: TestHttpClient;
    private readonly healthController: HealthController;

    constructor(httpClient: AxiosInstance, baseUrl: string) {
        this.httpClient = httpClient;
        this.testHttpClient = new TestHttpClient(httpClient, baseUrl);
        this.healthController = new HealthController(this.testHttpClient);
    }

    health(): HealthController {
        return this.healthController;
    }
}
