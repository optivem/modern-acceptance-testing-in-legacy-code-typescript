import { TestHttpClient, TestHttpUtils } from '@optivem/commons-http';
import { Result } from '@optivem/commons-testing-dsl';

export class HealthController {
    private static readonly HEALTH_PATH = '/health';

    constructor(private readonly httpClient: TestHttpClient) {}

    async checkHealth(): Promise<Result<void>> {
        const response = await this.httpClient.get<void>(HealthController.HEALTH_PATH);
        return TestHttpUtils.getOkResultOrFailure(response);
    }
}
