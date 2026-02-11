import { Result } from '@optivem/commons/util';
import { JsonHttpClient } from '@optivem/commons/http';
import { ExtGetTimeResponse } from './dtos/ExtGetTimeResponse.js';
import { ExtClockErrorResponse } from './dtos/error/ExtClockErrorResponse.js';

export class ClockStubClient {
    private static readonly HEALTH_ENDPOINT = '/health';
    private static readonly TIME_ENDPOINT = '/api/time';

    private readonly httpClient: JsonHttpClient<ExtClockErrorResponse>;

    constructor(baseUrl: string) {
        this.httpClient = new JsonHttpClient<ExtClockErrorResponse>(baseUrl);
    }

    async checkHealth(): Promise<Result<void, ExtClockErrorResponse>> {
        return this.httpClient.getAsync<void>(ClockStubClient.HEALTH_ENDPOINT);
    }

    async getTime(): Promise<Result<ExtGetTimeResponse, ExtClockErrorResponse>> {
        return this.httpClient.getAsync<ExtGetTimeResponse>(ClockStubClient.TIME_ENDPOINT);
    }
}
