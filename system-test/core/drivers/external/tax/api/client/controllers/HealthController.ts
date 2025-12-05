import { HttpGateway } from '../../../../../commons/clients/HttpGateway.js';
import { HttpUtils } from '../../../../../commons/clients/HttpUtils.js';
import { Result } from '../../../../../commons/Result.js';

export class HealthController {
    private static readonly ENDPOINT = '/health';
    private readonly httpClient: HttpGateway;

    constructor(httpClient: HttpGateway) {
        this.httpClient = httpClient;
    }

    async checkHealth(): Promise<Result<void>> {
        const httpResponse = await this.httpClient.get<void>(HealthController.ENDPOINT);
        return HttpUtils.getOkResultOrFailure<void>(httpResponse);
    }
}
