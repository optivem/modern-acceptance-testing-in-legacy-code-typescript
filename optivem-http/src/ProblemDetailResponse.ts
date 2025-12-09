import { ProblemDetailsFieldErrorResponse } from './ProblemDetailsFieldErrorResponse.js';

export interface ProblemDetailResponse {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: ProblemDetailsFieldErrorResponse[];
}
