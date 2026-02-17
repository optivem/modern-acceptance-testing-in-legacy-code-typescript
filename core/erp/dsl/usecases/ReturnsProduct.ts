import { VoidVerification, UseCaseContext } from '@optivem/commons/dsl';
import { Converter } from '@optivem/commons/util';
import type { Optional } from '@optivem/commons/util';
import type { ErpDriver } from '../../driver/ErpDriver.js';
import type { ReturnsProductRequest } from '../../driver/dtos/ReturnsProductRequest.js';
import { BaseErpCommand } from './base/BaseErpCommand.js';
import { ErpUseCaseResult } from './base/ErpUseCaseResult.js';

export class ReturnsProduct extends BaseErpCommand<void, VoidVerification> {
    private skuParamAlias: Optional<string>;
    private unitPriceValue: Optional<string>;

    constructor(driver: ErpDriver, context: UseCaseContext) {
        super(driver, context);
    }

    sku(skuParamAlias: Optional<string>): ReturnsProduct {
        this.skuParamAlias = skuParamAlias;
        return this;
    }

    unitPrice(value: Optional<string | number>): ReturnsProduct {
        this.unitPriceValue =
            value === undefined || value === null ? undefined : typeof value === 'number' ? Converter.fromDouble(value) : value;
        return this;
    }

    async execute(): Promise<ErpUseCaseResult<void, VoidVerification>> {
        const sku = this.context.getParamValue(this.skuParamAlias);
        const request: ReturnsProductRequest = {
            sku,
            price: this.unitPriceValue,
        };
        const result = await this.driver.returnsProduct(request);
        return new ErpUseCaseResult<void, VoidVerification>(
            result,
            this.context,
            (response, ctx) => new VoidVerification(response, ctx)
        );
    }
}
