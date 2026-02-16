import type { JsonHttpClient } from '@optivem/commons/http';
import type { Result } from '@optivem/commons/util';
import type { ProblemDetailsResponse } from '../../dtos/errors/ProblemDetailsResponse.js';

export class HealthController {
    private static readonly HEALTH_PATH = '/health';

    constructor(private readonly httpClient: JsonHttpClient<ProblemDetailsResponse>) {}

    checkHealth(): Promise<Result<void, ProblemDetailsResponse>> {
        return this.httpClient.getAsync<void>(HealthController.HEALTH_PATH);
    }
}
