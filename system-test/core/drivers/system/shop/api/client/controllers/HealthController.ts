import { HttpGateway } from '../../../../../commons/clients/HttpGateway.js';
import { HttpUtils } from '../../../../../commons/clients/HttpUtils.js';
import { Result } from '../../../../../commons/Result.js';

export class HealthController {
    private static readonly HEALTH_PATH = '/health';

    constructor(private readonly httpClient: HttpGateway) {}

    async checkHealth(): Promise<Result<void>> {
        const response = await this.httpClient.get<void>(HealthController.HEALTH_PATH);
        return HttpUtils.getOkResultOrFailure(response);
    }
}
