import { TestHttpClient } from '../../../../../commons/clients/TestHttpClient.js';
import { TestHttpUtils } from '../../../../../commons/clients/TestHttpUtils.js';
import { Result } from '../../../../../commons/Result.js';

export class HealthController {
    private static readonly HEALTH_PATH = '/health';

    constructor(private readonly httpClient: TestHttpClient) {}

    async checkHealth(): Promise<Result<void>> {
        const response = await this.httpClient.get<void>(HealthController.HEALTH_PATH);
        return TestHttpUtils.getOkResultOrFailure(response);
    }
}
