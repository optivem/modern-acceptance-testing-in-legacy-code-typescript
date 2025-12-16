import { TaxApiDriver } from '../../../driver/TaxApiDriver.js';
import { BaseUseCase, UseCaseContext } from '@optivem/testing-dsl';
import { Error } from '../../../../core-commons/error/index.js';
import { ErrorFailureVerification } from '../../../../core-commons/dsl/index.js';

export abstract class BaseTaxCommand<TResponse, TVerification> extends BaseUseCase<
    TaxApiDriver,
    UseCaseContext,
    TResponse,
    Error,
    TVerification,
    ErrorFailureVerification
> {
    protected constructor(driver: TaxApiDriver, context: UseCaseContext) {
        super(driver, context);
    }
}
