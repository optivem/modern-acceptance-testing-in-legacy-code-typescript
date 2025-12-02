import { TestHttpClient } from '../../../../../commons/clients/TestHttpClient.js';
import { TestHttpUtils } from '../../../../../commons/clients/TestHttpUtils.js';
import { Result } from '../../../../../commons/Result.js';

export class HealthController {
    private static readonly ENDPOINT = '/health';
    private readonly httpClient: TestHttpClient;

    constructor(httpClient: TestHttpClient) {
        this.httpClient = httpClient;
    }

    async checkHealth(): Promise<Result<void>> {
        const httpResponse = await this.httpClient.get<void>(HealthController.ENDPOINT);
        return TestHttpUtils.getOkResultOrFailure<void>(httpResponse);
    }
}
