import { BaseUseCase, UseCaseContext } from '@optivem/commons/dsl';
import type { ErpDriver } from '@optivem/driver-api/erp/ErpDriver.js';
import type { ErpErrorResponse } from '@optivem/driver-api/erp/dtos/error/ErpErrorResponse.js';
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


