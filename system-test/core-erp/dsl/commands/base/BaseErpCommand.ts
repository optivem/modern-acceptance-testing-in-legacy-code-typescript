import { ErpApiDriver } from '../../../driver/ErpApiDriver.js';
import { BaseUseCase, UseCaseContext } from '@optivem/testing-dsl';
import { Error } from '../../../../core-commons/error/index.js';
import { ErrorFailureVerification } from '../../../../core-commons/dsl/index.js';

export abstract class BaseErpCommand<TResponse, TVerification> extends BaseUseCase<
    ErpApiDriver,
    UseCaseContext,
    TResponse,
    Error,
    TVerification,
    ErrorFailureVerification
> {
    protected constructor(driver: ErpApiDriver, context: UseCaseContext) {
        super(driver, context);
    }
}
