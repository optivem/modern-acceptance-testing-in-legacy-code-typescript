import { AxiosInstance } from 'axios';
import { HttpGateway } from '@optivem/commons/http';
import { HealthController } from './controllers/HealthController.js';
import { ProductController } from './controllers/ProductController.js';

export class ErpApiClient {
    private readonly httpClient: AxiosInstance;
    private readonly testHttpClient: HttpGateway;
    private readonly healthController: HealthController;
    private readonly productController: ProductController;

    constructor(httpClient: AxiosInstance, baseUrl: string) {
        this.httpClient = httpClient;
        this.testHttpClient = new HttpGateway(httpClient, baseUrl);
        this.healthController = new HealthController(this.testHttpClient);
        this.productController = new ProductController(this.testHttpClient);
    }

    health(): HealthController {
        return this.healthController;
    }

    products(): ProductController {
        return this.productController;
    }
}


