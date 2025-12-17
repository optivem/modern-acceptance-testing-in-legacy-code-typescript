import { Result } from '@optivem/lang';
import { Error, createError, FieldError, createFieldError } from './Error.js';

export const success = <T>(value?: T): Result<T, Error> => {
    return Result.success<T, Error>(value);
};

export const failure = <T>(message: string, fieldErrors?: FieldError[]): Result<T, Error> => {
    const error = createError(message, fieldErrors);
    return Result.failure<T, Error>(error);
};

export const failureFromError = <T>(error: Error): Result<T, Error> => {
    return Result.failure<T, Error>(error);
};


