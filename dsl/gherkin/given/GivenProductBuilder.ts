import { Converter } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenProductBuilder extends BaseGivenBuilder {
    private skuValue: string;
    private unitPriceValue: string;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.withSku(GherkinDefaults.DEFAULT_SKU);
        this.withUnitPrice(GherkinDefaults.DEFAULT_UNIT_PRICE);
    }

    withSku(sku: string): this {
        this.skuValue = sku;
        return this;
    }

    withUnitPrice(unitPrice: string): this {
        this.unitPriceValue = unitPrice;
        return this;
    }

    withUnitPrice(unitPrice: number): this {
        return this.withUnitPrice(Converter.fromDouble(unitPrice));
    }

    async execute(app: SystemDsl): Promise<void> {
        await app
            .erp()
            .returnsProduct()
            .sku(this.skuValue)
            .unitPrice(this.unitPriceValue)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
