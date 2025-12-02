import { TestHttpClient } from '../../../../commons/clients/TestHttpClient.js';
import { HealthController } from './controllers/HealthController.js';
import { ProductController } from './controllers/ProductController.js';

export class ErpApiClient {
    private readonly testHttpClient: TestHttpClient;
    private readonly healthController: HealthController;
    private readonly productController: ProductController;

    constructor(baseUrl: string) {
        this.testHttpClient = new TestHttpClient(baseUrl);
        this.healthController = new HealthController(this.testHttpClient);
        this.productController = new ProductController(this.testHttpClient);
    }

    health(): HealthController {
        return this.healthController;
    }

    products(): ProductController {
        return this.productController;
    }

    close(): void {
        // Cleanup if needed
    }
}
