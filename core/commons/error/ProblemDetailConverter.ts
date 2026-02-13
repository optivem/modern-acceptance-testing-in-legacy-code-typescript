import { Error, createError, createFieldError } from './Error.js';

/** API error shape (e.g. RFC 7807 problem details or similar). */
export interface ProblemDetail {
    status?: number;
    title?: string;
    detail?: string;
    errors?: Array<{ field?: string; message?: string; code?: string }>;
}

export const toError = (problemDetail: ProblemDetail): Error => {
    const message = problemDetail.detail ?? problemDetail.title ?? 'Request failed';

    if (problemDetail.errors && problemDetail.errors.length > 0) {
        const fieldErrors = problemDetail.errors.map((e: { field?: string; message?: string; code?: string }) =>
            createFieldError(e.field ?? '', e.message ?? '', e.code)
        );
        return createError(message, fieldErrors);
    }

    return createError(message);
};


