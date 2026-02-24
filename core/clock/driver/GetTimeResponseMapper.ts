import type { GetTimeResponse } from '@optivem/driver-api/clock/driver/dtos/GetTimeResponse.js';
import type { ExtGetTimeResponse } from '../client/dtos/ExtGetTimeResponse.js';

export function from(response: ExtGetTimeResponse): GetTimeResponse {
    return {
        time: new Date(response.time),
    };
}
