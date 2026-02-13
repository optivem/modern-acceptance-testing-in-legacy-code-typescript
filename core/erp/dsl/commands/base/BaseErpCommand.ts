import { BaseUseCase, UseCaseContext } from '@optivem/commons/dsl';
import type { ErpDriver } from '../../../driver/ErpDriver.js';
import type { ErpErrorResponse } from '../../../driver/dtos/error/ErpErrorResponse.js';
import { ErpErrorVerification } from './ErpErrorVerification.js';

export abstract class BaseErpCommand<TResponse, TVerification> extends BaseUseCase<
    ErpDriver,
    TResponse,
    ErpErrorResponse,
    TVerification,
    ErpErrorVerification
> {
    protected constructor(driver: ErpDriver, context: UseCaseContext) {
        super(driver, context);
    }
}


