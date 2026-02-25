import type { ClockErrorResponse } from '@optivem/driver-api/clock/dtos/error/ClockErrorResponse.js';
import type { ExtClockErrorResponse } from '../client/dtos/error/ExtClockErrorResponse.js';

export function from(response: ExtClockErrorResponse): ClockErrorResponse {
    return {
        message: response.message,
    };
}
