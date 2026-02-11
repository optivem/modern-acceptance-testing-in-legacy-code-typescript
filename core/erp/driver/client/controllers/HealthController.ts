import { HttpGateway, HttpUtils, ProblemDetailResponse } from '@optivem/commons/http';
import { Result } from '@optivem/commons/util';

export class HealthController {
    private static readonly ENDPOINT = '/health';
    private readonly httpClient: HttpGateway;

    constructor(httpClient: HttpGateway) {
        this.httpClient = httpClient;
    }

    async checkHealth(): Promise<Result<void, ProblemDetailResponse>> {
        const httpResponse = await this.httpClient.get<void>(HealthController.ENDPOINT);
        return HttpUtils.getOkResultOrFailure<void>(httpResponse);
    }
}


