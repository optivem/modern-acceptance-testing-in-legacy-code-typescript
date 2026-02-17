import { VoidVerification, UseCaseContext } from '@optivem/commons/dsl';
import { Converter } from '@optivem/commons/util';
import type { TaxDriver } from '../../driver/TaxDriver.js';
import type { ReturnsTaxRateRequest } from '../../driver/dtos/ReturnsTaxRateRequest.js';
import { BaseTaxCommand } from './base/BaseTaxCommand.js';
import { TaxUseCaseResult } from './base/TaxUseCaseResult.js';

export class ReturnsTaxRate extends BaseTaxCommand<void, VoidVerification> {
    private countryAlias: string | undefined;
    private taxRateValue: string | undefined;

    constructor(driver: TaxDriver, context: UseCaseContext) {
        super(driver, context);
    }

    country(countryAlias: string): ReturnsTaxRate {
        this.countryAlias = countryAlias;
        return this;
    }

    taxRate(taxRate: string): ReturnsTaxRate;
    taxRate(taxRate: number): ReturnsTaxRate;
    taxRate(taxRate: string | number): ReturnsTaxRate {
        this.taxRateValue = typeof taxRate === 'number' ? Converter.fromDouble(taxRate) : taxRate;
        return this;
    }

    async execute(): Promise<TaxUseCaseResult<void, VoidVerification>> {
        const country = this.context.getParamValueOrLiteral(this.countryAlias!);
        const request: ReturnsTaxRateRequest = {
            country,
            taxRate: this.taxRateValue,
        };
        const result = await this.driver.returnsTaxRate(request);
        return new TaxUseCaseResult(result, this.context, (response, ctx) => new VoidVerification(response, ctx));
    }
}
