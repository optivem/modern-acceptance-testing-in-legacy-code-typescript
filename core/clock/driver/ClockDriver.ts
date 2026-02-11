import { Result, Closeable } from '@optivem/commons/util';
import { GetTimeResponse } from './dtos/GetTimeResponse.js';
import { ReturnsTimeRequest } from './dtos/ReturnsTimeRequest.js';
import { ClockErrorResponse } from './dtos/error/ClockErrorResponse.js';

export interface ClockDriver extends Closeable {
    goToClock(): Promise<Result<void, ClockErrorResponse>>;
    getTime(): Promise<Result<GetTimeResponse, ClockErrorResponse>>;
    returnsTime(request: ReturnsTimeRequest): Promise<Result<void, ClockErrorResponse>>;
}
