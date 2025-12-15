import { HttpGateway, HttpUtils } from '@optivem/http';
import { Result } from '@optivem/lang';

export class HealthController {
    private static readonly HEALTH_PATH = '/health';

    constructor(private readonly httpClient: HttpGateway) {}

    async checkHealth(): Promise<Result<void>> {
        const response = await this.httpClient.get<void>(HealthController.HEALTH_PATH);
        return HttpUtils.getOkResultOrFailure(response);
    }
}
