import { AxiosInstance } from 'axios';
import { HttpGateway } from '../../../../commons/clients/HttpGateway.js';
import { HealthController } from './controllers/HealthController.js';

export class TaxApiClient {
    private readonly httpClient: AxiosInstance;
    private readonly testHttpClient: HttpGateway;
    private readonly healthController: HealthController;

    constructor(httpClient: AxiosInstance, baseUrl: string) {
        this.httpClient = httpClient;
        this.testHttpClient = new HttpGateway(httpClient, baseUrl);
        this.healthController = new HealthController(this.testHttpClient);
    }

    health(): HealthController {
        return this.healthController;
    }
}
