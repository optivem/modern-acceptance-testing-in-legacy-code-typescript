import { ErpApiDriver } from '../../../driver/ErpApiDriver.js';
import { BaseUseCase, UseCaseContext } from '@optivem/testing-dsl';
import { Error } from '../../../../common/error/index.js';
import { ErrorFailureVerification } from '../../../../common/dsl/index.js';

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
