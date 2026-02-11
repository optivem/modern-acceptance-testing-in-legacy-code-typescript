import { Result } from '@optivem/commons/util';
import { JsonHttpClient, HttpStatus } from '@optivem/commons/http';
import { JsonWireMockClient } from '@optivem/commons/wiremock';
import { ExtGetTimeResponse } from './dtos/ExtGetTimeResponse.js';
import { ExtClockErrorResponse, from as fromExtClockError } from './dtos/error/ExtClockErrorResponse.js';

export class ClockStubClient {
    private static readonly HEALTH_ENDPOINT = '/health';
    private static readonly TIME_ENDPOINT = '/api/time';

    private readonly httpClient: JsonHttpClient<ExtClockErrorResponse>;
    private readonly wireMockClient: JsonWireMockClient;

    constructor(baseUrl: string) {
        this.httpClient = new JsonHttpClient<ExtClockErrorResponse>(baseUrl);
        this.wireMockClient = new JsonWireMockClient(baseUrl);
    }

    async checkHealth(): Promise<Result<void, ExtClockErrorResponse>> {
        return this.httpClient.getAsync<void>(ClockStubClient.HEALTH_ENDPOINT);
    }

    async getTime(): Promise<Result<ExtGetTimeResponse, ExtClockErrorResponse>> {
        return this.httpClient.getAsync<ExtGetTimeResponse>(ClockStubClient.TIME_ENDPOINT);
    }

    async configureGetTime(response: ExtGetTimeResponse): Promise<Result<void, ExtClockErrorResponse>> {
        return this.wireMockClient
            .stubGet(ClockStubClient.TIME_ENDPOINT, HttpStatus.OK, response)
            .then((r) => r.mapError(fromExtClockError));
    }
}
