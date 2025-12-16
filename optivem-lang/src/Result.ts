export class Result<T, E = unknown> {
    private constructor(
        private readonly _success: boolean,
        private readonly _value?: T,
        private readonly _error?: E
    ) {}

    static success<T, E = unknown>(value?: T): Result<T, E> {
        return new Result<T, E>(true, value, undefined);
    }

    static failure<T, E = unknown>(error: E): Result<T, E> {
        return new Result<T, E>(false, undefined, error);
    }

    isSuccess(): boolean {
        return this._success;
    }

    isFailure(): boolean {
        return !this._success;
    }

    getValue(): T {
        if (!this._success) {
            throw new Error("Cannot get value from a failed result");
        }
        return this._value!;
    }

    getError(): E {
        if (this._success) {
            throw new Error("Cannot get error from a successful result");
        }
        return this._error!;
    }

    mapFailure<E2>(mapper: (error: E) => E2): Result<T, E2> {
        if (this._success) {
            return Result.success<T, E2>(this._value);
        }
        return Result.failure<T, E2>(mapper(this._error!));
    }
}
