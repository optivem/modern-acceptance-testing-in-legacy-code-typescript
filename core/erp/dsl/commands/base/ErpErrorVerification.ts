import { ResponseVerification, UseCaseContext } from '@optivem/commons/dsl';
import { ErpErrorResponse } from '../../../driver/dtos/error/ErpErrorResponse.js';
import { expect } from '@playwright/test';

export class ErpErrorVerification extends ResponseVerification<ErpErrorResponse> {
    constructor(error: ErpErrorResponse, context: UseCaseContext) {
        super(error, context);
    }

    errorMessage(expectedMessage: string): ErpErrorVerification {
        const expandedExpectedMessage = this.context.expandAliases(expectedMessage);
        const errorMessage = this.response.message ?? '';
        expect(
            errorMessage,
            `Expected error message: '${expandedExpectedMessage}', but got: '${errorMessage}'`
        ).toBe(expandedExpectedMessage);
        return this;
    }
}
