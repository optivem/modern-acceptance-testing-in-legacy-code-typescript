import { HttpGateway } from '../../../../../../../http/HttpGateway.js';
import { HttpUtils } from '../../../../../../../http/HttpUtils.js';
import { Result } from '../../../../../../../results/Result.js';

export class HealthController {
    private static readonly HEALTH_PATH = '/health';

    constructor(private readonly httpClient: HttpGateway) {}

    async checkHealth(): Promise<Result<void>> {
        const response = await this.httpClient.get<void>(HealthController.HEALTH_PATH);
        return HttpUtils.getOkResultOrFailure(response);
    }
}
