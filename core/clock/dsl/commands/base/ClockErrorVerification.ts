import { ResponseVerification, UseCaseContext } from '@optivem/commons/dsl';
import { ClockErrorResponse } from '../../../driver/dtos/error/ClockErrorResponse.js';
import { expect } from '@playwright/test';

export class ClockErrorVerification extends ResponseVerification<ClockErrorResponse> {
    constructor(error: ClockErrorResponse, context: UseCaseContext) {
        super(error, context);
    }

    message(expectedMessage: string): ClockErrorVerification {
        const expandedExpectedMessage = this.context.expandAliases(expectedMessage);
        const error = this.response;
        expect(error.message, `Expected error message: '${expandedExpectedMessage}', but got: '${error.message}'`)
            .toBe(expandedExpectedMessage);
        return this;
    }
}
