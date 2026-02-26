import { BaseUseCase, UseCaseContext } from '@optivem/dsl-common/dsl';
import type { TaxDriver } from '@optivem/driver-api/tax/TaxDriver.js';
import type { TaxErrorResponse } from '@optivem/driver-api/tax/dtos/error/TaxErrorResponse.js';
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
