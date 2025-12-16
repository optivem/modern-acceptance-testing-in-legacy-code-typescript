import { ShopDriver } from '../../../driver/ShopDriver.js';
import { BaseUseCase, UseCaseContext } from '@optivem/testing-dsl';
import { Error } from '../../../../commons/error/index.js';
import { ErrorFailureVerification } from '../../../../commons/dsl/index.js';

export abstract class BaseShopCommand<TResponse, TVerification> extends BaseUseCase<
    ShopDriver,
    UseCaseContext,
    TResponse,
    Error,
    TVerification,
    ErrorFailureVerification
> {
    protected constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }
}
