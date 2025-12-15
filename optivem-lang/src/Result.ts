export class Result<T> {
    private constructor(
        private readonly success: boolean,
        private readonly value?: T,
        private readonly errorMessages: string[] = []
    ) {}

    static success<T>(value?: T): Result<T> {
        return new Result(true, value, []);
    }

    static failure<T>(errorMessages: string | string[] = []): Result<T> {
        const messages = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
        return new Result<T>(false, undefined as any, messages);
    }

    isSuccess(): boolean {
        return this.success;
    }

    isFailure(): boolean {
        return !this.success;
    }

    getValue(): T {
        if (!this.success) {
            throw new Error("Cannot get value from a failed result");
        }
        return this.value!;
    }

    getErrorMessages(): string[] {
        if(this.success) {
            throw new Error("Cannot get error messages from a successful result");
        }

        return this.errorMessages;
    }
}
