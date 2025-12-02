import { TestHttpClient } from '../../../../commons/clients/TestHttpClient.js';
import { HealthController } from './controllers/HealthController.js';

export class TaxApiClient {
    private readonly testHttpClient: TestHttpClient;
    private readonly healthController: HealthController;

    constructor(baseUrl: string) {
        this.testHttpClient = new TestHttpClient(baseUrl);
        this.healthController = new HealthController(this.testHttpClient);
    }

    health(): HealthController {
        return this.healthController;
    }

    close(): void {
        // Cleanup if needed
    }
}
