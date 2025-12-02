import { expect } from '@jest/globals';
import { Result } from './Result.js';

export class ResultAssert {
    static assertSuccess<T>(result: Result<T>): void {
        if (!result.isSuccess()) {
            const errors = result.getErrorMessages().join(', ');
            throw new Error(`Expected result to be success but was failure with errors: ${errors}`);
        }
    }

    static assertFailure<T>(result: Result<T>): void {
        expect(result.isFailure()).toBeTruthy();
    }

    static assertFailureWithMessage<T>(result: Result<T>, expectedMessage: string): void {
        ResultAssert.assertFailure(result);
        const errorMessages = result.getErrorMessages();
        expect(errorMessages).toContain(expectedMessage);
    }

    static assertFailureWithMessages<T>(result: Result<T>, expectedMessages: string[]): void {
        ResultAssert.assertFailure(result);
        const errorMessages = result.getErrorMessages();
        expect(errorMessages).toEqual(expect.arrayContaining(expectedMessages));
    }
}
