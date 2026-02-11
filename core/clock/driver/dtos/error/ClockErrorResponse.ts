import { ExtClockErrorResponse } from '../../../client/dtos/error/ExtClockErrorResponse.js';

export interface ClockErrorResponse {
    message: string;
}

export function from(response: ExtClockErrorResponse): ClockErrorResponse {
    return {
        message: response.message,
    };
}
