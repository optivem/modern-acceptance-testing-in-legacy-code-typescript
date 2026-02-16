import { ResponseVerification, UseCaseContext } from '@optivem/commons/dsl';
import { Decimal } from '@optivem/commons/util';
import { GetProductResponse } from '../../driver/dtos/GetProductResponse.js';
import { expect } from '@playwright/test';

export class GetProductVerification extends ResponseVerification<GetProductResponse> {
    constructor(response: GetProductResponse, context: UseCaseContext) {
        super(response, context);
    }

    sku(skuParamAlias: string): GetProductVerification {
        const expectedSku = this.context.getParamValue(skuParamAlias);
        const actualSku = this.response.sku;
        expect(
            actualSku,
            `Expected SKU to be '${expectedSku}', but was '${actualSku}'`
        ).toBe(expectedSku);
        return this;
    }

    price(expectedPrice: Decimal): GetProductVerification {
        const actualPrice = this.response.price;
        expect(
            actualPrice.eq(expectedPrice),
            `Expected price to be ${expectedPrice.toString()}, but was ${actualPrice.toString()}`
        ).toBe(true);
        return this;
    }

    price(expectedPrice: string): GetProductVerification {
        return this.price(Decimal.fromString(expectedPrice));
    }
}
