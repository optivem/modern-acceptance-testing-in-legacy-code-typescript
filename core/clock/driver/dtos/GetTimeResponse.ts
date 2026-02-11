import { ExtGetTimeResponse } from '../../client/dtos/ExtGetTimeResponse.js';

export interface GetTimeResponse {
    time: Date;
}

export function fromExtGetTimeResponse(response: ExtGetTimeResponse): GetTimeResponse {
    return {
        time: new Date(response.time),
    };
}
