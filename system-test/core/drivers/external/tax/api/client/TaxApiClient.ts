import { Closer } from '../../../../commons/clients/Closer.js';
import { AxiosInstance } from 'axios';
import { TestHttpClient } from '../../../../commons/clients/TestHttpClient.js';
import { HealthController } from './controllers/HealthController.js';

export class TaxApiClient {
    private readonly testHttpClient: TestHttpClient;
    private readonly healthController: HealthController;

    constructor(httpClient: AxiosInstance, baseUrl: string) {
        this.testHttpClient = new TestHttpClient(httpClient, baseUrl);
        this.healthController = new HealthController(this.testHttpClient);
    }

    health(): HealthController {
        return this.healthController;
    }

    close(): void {
        Closer.close(this.testHttpClient);
    }
}
