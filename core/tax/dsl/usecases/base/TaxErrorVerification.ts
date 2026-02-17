import { ResponseVerification, UseCaseContext } from '@optivem/commons/dsl';
import type { TaxErrorResponse } from '../../../driver/dtos/error/TaxErrorResponse.js';
import { expect } from '@playwright/test';

export class TaxErrorVerification extends ResponseVerification<TaxErrorResponse> {
    constructor(error: TaxErrorResponse, context: UseCaseContext) {
        super(error, context);
    }

    errorMessage(expectedMessage: string): TaxErrorVerification {
        const expandedExpectedMessage = this.context.expandAliases(expectedMessage);
        const errorMessage = this.response.message;
        expect(
            errorMessage,
            `Expected error message: '${expandedExpectedMessage}', but got: '${errorMessage}'`
        ).toBe(expandedExpectedMessage);
        return this;
    }
}
