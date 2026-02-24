import { BaseUseCase, UseCaseContext } from '@optivem/commons/dsl';
import type { TaxDriver } from '@optivem/driver-api/tax/driver/TaxDriver.js';
import type { TaxErrorResponse } from '@optivem/driver-api/tax/driver/dtos/error/TaxErrorResponse.js';
import { TaxErrorVerification } from './TaxErrorVerification.js';

export abstract class BaseTaxCommand<TResponse, TVerification> extends BaseUseCase<
    TaxDriver,
    TResponse,
    TaxErrorResponse,
    TVerification,
    TaxErrorVerification
> {
    protected constructor(driver: TaxDriver, context: UseCaseContext) {
        super(driver, context);
    }
}
