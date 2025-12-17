import { ProblemDetailResponse } from '@optivem/http';
import { Error, createError, createFieldError } from './Error.js';

export const toError = (problemDetail: ProblemDetailResponse): Error => {
    const message = problemDetail.detail ?? 'Request failed';

    if (problemDetail.errors && problemDetail.errors.length > 0) {
        const fieldErrors = problemDetail.errors.map(e => 
            createFieldError(e.field, e.message, e.code)
        );
        return createError(message, fieldErrors);
    }

    return createError(message);
};


