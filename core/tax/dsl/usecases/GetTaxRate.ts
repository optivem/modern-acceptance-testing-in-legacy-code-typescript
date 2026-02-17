import { UseCaseContext } from '@optivem/commons/dsl';
import type { Optional } from '@optivem/commons/util';
import type { TaxDriver } from '../../driver/TaxDriver.js';
import type { GetTaxResponse } from '../../driver/dtos/GetTaxResponse.js';
import { BaseTaxCommand } from './base/BaseTaxCommand.js';
import { TaxUseCaseResult } from './base/TaxUseCaseResult.js';
import { GetTaxVerification } from './GetTaxVerification.js';

export class GetTaxRate extends BaseTaxCommand<GetTaxResponse, GetTaxVerification> {
    private countryValueOrAlias: Optional<string>;

    constructor(driver: TaxDriver, context: UseCaseContext) {
        super(driver, context);
    }

    country(countryValueOrAlias: string): GetTaxRate {
        this.countryValueOrAlias = countryValueOrAlias;
        return this;
    }

    async execute(): Promise<TaxUseCaseResult<GetTaxResponse, GetTaxVerification>> {
        const country = this.context.getParamValueOrLiteral(this.countryValueOrAlias!);
        const result = await this.driver.getTaxRate(country);
        return new TaxUseCaseResult(result, this.context, (response, ctx) => new GetTaxVerification(response, ctx));
    }
}
