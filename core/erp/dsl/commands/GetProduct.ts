import { UseCaseContext } from '@optivem/commons/dsl';
import type { ErpDriver } from '../../driver/ErpDriver.js';
import type { GetProductRequest } from '../../driver/dtos/GetProductRequest.js';
import type { GetProductResponse } from '../../driver/dtos/GetProductResponse.js';
import { BaseErpCommand } from './base/BaseErpCommand.js';
import { ErpUseCaseResult } from './base/ErpUseCaseResult.js';
import { GetProductVerification } from '../verifications/GetProductVerification.js';

export class GetProduct extends BaseErpCommand<GetProductResponse, GetProductVerification> {
    private skuParamAlias: string | undefined;

    constructor(driver: ErpDriver, context: UseCaseContext) {
        super(driver, context);
    }

    sku(alias: string | undefined): GetProduct {
        this.skuParamAlias = alias;
        return this;
    }

    async execute(): Promise<ErpUseCaseResult<GetProductResponse, GetProductVerification>> {
        const sku = this.context.getParamValue(this.skuParamAlias as string);
        const request: GetProductRequest = { sku };
        const result = await this.driver.getProduct(request);
        return new ErpUseCaseResult<GetProductResponse, GetProductVerification>(
            result,
            this.context,
            (response, ctx) => new GetProductVerification(response, ctx)
        );
    }
}
