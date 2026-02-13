import { VoidVerification, UseCaseContext } from '@optivem/commons/dsl';
import type { ErpDriver } from '../../driver/ErpDriver.js';
import type { ReturnsProductRequest } from '../../driver/dtos/ReturnsProductRequest.js';
import { BaseErpCommand } from './base/BaseErpCommand.js';
import { ErpUseCaseResult } from './base/ErpUseCaseResult.js';

export class ReturnsProduct extends BaseErpCommand<void, VoidVerification> {
    private _skuParamAlias: string = 'DEFAULT-SKU';
    private _unitPrice: string = '20.00';

    constructor(driver: ErpDriver, context: UseCaseContext) {
        super(driver, context);
    }

    sku(alias: string): ReturnsProduct {
        this._skuParamAlias = alias;
        return this;
    }

    unitPrice(value: string | number): ReturnsProduct {
        this._unitPrice = typeof value === 'number' ? value.toString() : value;
        return this;
    }

    async execute(): Promise<ErpUseCaseResult<void, VoidVerification>> {
        const sku = this.context.getParamValue(this._skuParamAlias);
        const request: ReturnsProductRequest = {
            sku,
            price: this._unitPrice,
        };
        const result = await this.driver.returnsProduct(request);
        return new ErpUseCaseResult<void, VoidVerification>(
            result,
            this.context,
            (response, ctx) => new VoidVerification(response, ctx)
        );
    }
}
