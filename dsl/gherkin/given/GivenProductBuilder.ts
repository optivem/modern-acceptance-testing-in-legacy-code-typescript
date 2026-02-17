import { Converter } from '@optivem/commons/util';
import type { Optional } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenProductBuilder extends BaseGivenBuilder {
    private sku: Optional<string>;
    private unitPrice: Optional<string>;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.withSku(GherkinDefaults.DEFAULT_SKU);
        this.withUnitPrice(GherkinDefaults.DEFAULT_UNIT_PRICE);
    }

    withSku(sku: Optional<string>): this {
        this.sku = sku;
        return this;
    }

    withUnitPrice(unitPrice: Optional<string>): this;
    withUnitPrice(unitPrice: number): this;
    withUnitPrice(unitPrice: Optional<string> | number): this {
        this.unitPrice = typeof unitPrice === 'number' ? Converter.fromDouble(unitPrice) : unitPrice;
        return this;
    }

    async execute(app: SystemDsl): Promise<void> {
        await app
            .erp()
            .returnsProduct()
            .sku(this.sku)
            .unitPrice(this.unitPrice)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
