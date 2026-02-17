import { Converter } from '@optivem/commons/util';
import type { SystemDsl } from '../../system/SystemDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenBuilder.js';
import type { GivenClause } from './GivenClause.js';

export class GivenCountryBuilder extends BaseGivenBuilder {
    private countryValue: string = GherkinDefaults.DEFAULT_COUNTRY;
    private taxRateValue: string = GherkinDefaults.DEFAULT_TAX_RATE;

    constructor(givenClause: GivenClause) {
        super(givenClause);
    }

    withCode(country: string): this {
        this.countryValue = country;
        return this;
    }

    withTaxRate(taxRate: string): this {
        this.taxRateValue = taxRate;
        return this;
    }

    withTaxRate(taxRate: number): this {
        return this.withTaxRate(Converter.fromDouble(taxRate));
    }

    async execute(app: SystemDsl): Promise<void> {
        await app
            .tax()
            .returnsTaxRate()
            .country(this.countryValue)
            .taxRate(this.taxRateValue)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
