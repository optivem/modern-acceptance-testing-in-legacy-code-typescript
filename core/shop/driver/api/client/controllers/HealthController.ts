import { HttpGateway, HttpUtils, ProblemDetailResponse } from '@optivem/commons/http';
import { Result } from '@optivem/commons/util';

export class HealthController {
    private static readonly HEALTH_PATH = '/health';

    constructor(private readonly httpClient: HttpGateway) {}

    async checkHealth(): Promise<Result<void, ProblemDetailResponse>> {
        const response = await this.httpClient.get<void>(HealthController.HEALTH_PATH);
        return HttpUtils.getOkResultOrFailure(response);
    }
}


