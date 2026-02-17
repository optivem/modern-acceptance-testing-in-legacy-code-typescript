import { Converter } from '@optivem/commons/util';
import type { Optional } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenCountryBuilder extends BaseGivenBuilder {
    private country: Optional<string>;
    private taxRate: Optional<string>;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.withCode(GherkinDefaults.DEFAULT_COUNTRY);
        this.withTaxRate(GherkinDefaults.DEFAULT_TAX_RATE);
    }

    withCode(country: Optional<string>): this {
        this.country = country;
        return this;
    }

    withTaxRate(taxRate: Optional<string>): this {
        this.taxRate = taxRate;
        return this;
    }

    withTaxRate(taxRate: number): this {
        return this.withTaxRate(Converter.fromDouble(taxRate));
    }

    async execute(app: SystemDsl): Promise<void> {
        await app
            .tax()
            .returnsTaxRate()
            .country(this.country)
            .taxRate(this.taxRate)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
