import { ClockStubClient } from '../client/ClockStubClient.js';
import { JsonWireMockClient } from '@optivem/commons/wiremock';
import { HttpStatus } from '@optivem/commons/http';
import { GetTimeResponse, from } from './dtos/GetTimeResponse.js';
import { ReturnsTimeRequest } from './dtos/ReturnsTimeRequest.js';
import { ClockErrorResponse, from as fromClockErrorResponse } from './dtos/error/ClockErrorResponse.js';
import { ExtGetTimeResponse } from '../client/dtos/ExtGetTimeResponse.js';
import { from as fromExtClockError } from '../client/dtos/error/ExtClockErrorResponse.js';
import { Result } from '@optivem/commons/util';
import { Closer } from '@optivem/commons/util';
import { ClockDriver } from './ClockDriver.js';

const CLOCK_TIME_ENDPOINT = '/clock/api/time';

export class ClockStubDriver implements ClockDriver {
    private readonly client: ClockStubClient;
    private readonly wireMockClient: JsonWireMockClient;

    constructor(baseUrl: string) {
        this.client = new ClockStubClient(baseUrl);
        this.wireMockClient = new JsonWireMockClient(baseUrl);
    }

    close(): void {
        Closer.close(this.client);
        Closer.close(this.wireMockClient);
    }

    async goToClock(): Promise<Result<void, ClockErrorResponse>> {
        const result = await this.client.checkHealth();
        return result.mapError(fromClockErrorResponse);
    }

    async getTime(): Promise<Result<GetTimeResponse, ClockErrorResponse>> {
        const result = await this.client.getTime();
        return result.map(from).mapError(fromClockErrorResponse);
    }

    async returnsTime(request: ReturnsTimeRequest): Promise<Result<void, ClockErrorResponse>> {
        const extResponse: ExtGetTimeResponse = { time: request.time };
        const stubResult = await this.wireMockClient.stubGet(CLOCK_TIME_ENDPOINT, HttpStatus.OK, extResponse);
        return stubResult
            .mapError((msg: string) => fromClockErrorResponse(fromExtClockError(msg)))
            .mapVoid();
    }
}
