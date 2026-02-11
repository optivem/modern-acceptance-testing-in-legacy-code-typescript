import { ExtGetTimeResponse } from '../../client/dtos/ExtGetTimeResponse.js';

export interface GetTimeResponse {
    time: Date;
}

export function from(response: ExtGetTimeResponse): GetTimeResponse {
    return {
        time: new Date(response.time),
    };
}
