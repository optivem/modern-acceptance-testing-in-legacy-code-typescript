import { Result } from '@optivem/commons/util';
import { ClockRealClient } from '../client/ClockRealClient.js';
import { GetTimeResponse, from } from './dtos/GetTimeResponse.js';
import { ReturnsTimeRequest } from './dtos/ReturnsTimeRequest.js';
import { ClockErrorResponse, from as fromClockErrorResponse } from './dtos/error/ClockErrorResponse.js';
import { ClockDriver } from './ClockDriver.js';

export class ClockRealDriver implements ClockDriver {
    private readonly client: ClockRealClient;

    constructor() {
        this.client = new ClockRealClient();
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

    async returnsTime(_request: ReturnsTimeRequest): Promise<Result<void, ClockErrorResponse>> {
        // No-op for real driver - cannot configure system clock
        return Result.success<void, ClockErrorResponse>();
    }
}
