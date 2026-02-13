import { ClockStubClient } from '../client/ClockStubClient.js';
import { GetTimeResponse, from } from './dtos/GetTimeResponse.js';
import { ReturnsTimeRequest } from './dtos/ReturnsTimeRequest.js';
import { ClockErrorResponse, from as fromClockErrorResponse } from './dtos/error/ClockErrorResponse.js';
import { ExtGetTimeResponse } from '../client/dtos/ExtGetTimeResponse.js';
import { Result } from '@optivem/commons/util';
import { ClockDriver } from './ClockDriver.js';

export class ClockStubDriver implements ClockDriver {
    private readonly client: ClockStubClient;

    constructor(baseUrl: string) {
        this.client = new ClockStubClient(baseUrl);
    }

    close(): void {
        // No resources to dispose
    }

    async goToClock(): Promise<Result<void, ClockErrorResponse>> {
        return this.client.checkHealth().then((r) => r.mapError(fromClockErrorResponse));
    }

    async getTime(): Promise<Result<GetTimeResponse, ClockErrorResponse>> {
        return this.client.getTime().then((r) => r.map(from).mapError(fromClockErrorResponse));
    }

    async returnsTime(request: ReturnsTimeRequest): Promise<Result<void, ClockErrorResponse>> {
        const extResponse: ExtGetTimeResponse = { time: request.time ?? '' };
        return this.client.configureGetTime(extResponse).then((r) => r.mapError(fromClockErrorResponse));
    }
}
