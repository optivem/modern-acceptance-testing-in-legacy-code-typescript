import type { JsonHttpClient } from '@optivem/commons/http';
import type { Result } from '@optivem/commons/util';
import type { ProblemDetailResponse } from '../dtos/errors/ProblemDetailResponse.js';

export class HealthController {
    private static readonly HEALTH_PATH = '/health';

    constructor(private readonly httpClient: JsonHttpClient<ProblemDetailResponse>) {}

    checkHealth(): Promise<Result<void, ProblemDetailResponse>> {
        return this.httpClient.getAsync<void>(HealthController.HEALTH_PATH);
    }
}
