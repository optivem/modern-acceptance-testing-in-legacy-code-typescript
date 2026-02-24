import { Result } from '@optivem/commons/util';
import { ClockRealClient } from '../client/ClockRealClient.js';
import type { ClockDriver } from '@optivem/driver-api/clock/driver/ClockDriver.js';
import type { GetTimeResponse } from '@optivem/driver-api/clock/driver/dtos/GetTimeResponse.js';
import type { ReturnsTimeRequest } from '@optivem/driver-api/clock/driver/dtos/ReturnsTimeRequest.js';
import type { ClockErrorResponse } from '@optivem/driver-api/clock/driver/dtos/error/ClockErrorResponse.js';
import { from as fromGetTimeResponse } from './GetTimeResponseMapper.js';
import { from as fromClockErrorResponse } from './ClockErrorResponseMapper.js';

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
        return this.client.getTime().then((r) => r.map(fromGetTimeResponse).mapError(fromClockErrorResponse));
    }

    async returnsTime(_request: ReturnsTimeRequest): Promise<Result<void, ClockErrorResponse>> {
        // No-op for real driver - cannot configure system clock
        return Result.success<void, ClockErrorResponse>();
    }
}
