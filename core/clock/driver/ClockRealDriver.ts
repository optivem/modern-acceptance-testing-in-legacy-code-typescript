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
        const result = await this.client.checkHealth();
        return result.mapError(fromClockErrorResponse);
    }

    async getTime(): Promise<Result<GetTimeResponse, ClockErrorResponse>> {
        const result = await this.client.getTime();
        return result.map(from).mapError(fromClockErrorResponse);
    }

    async returnsTime(_request: ReturnsTimeRequest): Promise<Result<void, ClockErrorResponse>> {
        // No-op for real driver - cannot configure system clock
        return Result.success<void, ClockErrorResponse>();
    }
}
