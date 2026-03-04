import type { AppDsl } from '../../app/AppDsl.js';
import type {
    ThenGivenStagePort,
    ThenGivenClockPort,
    ThenGivenProductPort,
    ThenGivenCountryPort,
} from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { GetTimeVerification } from '../../app/clock/usecases/GetTimeVerification.js';
import type { GetProductVerification } from '../../app/erp/usecases/GetProductVerification.js';
import type { GetTaxVerification } from '../../app/tax/usecases/GetTaxVerification.js';

export class ThenGivenStage implements ThenGivenStagePort {
    private setupExecuted = false;

    constructor(
        private readonly app: AppDsl,
        private readonly givenSetup: () => Promise<void>
    ) {}

    private async ensureSetup(): Promise<void> {
        if (!this.setupExecuted) {
            await this.givenSetup();
            this.setupExecuted = true;
        }
    }

    async clock(): Promise<ThenGivenClockPort> {
        await this.ensureSetup();
        const verification = (await this.app.clock().getTime().execute()).shouldSucceed();
        return new ThenGivenClock(verification);
    }

    async product(skuAlias: string): Promise<ThenGivenProductPort> {
        await this.ensureSetup();
        const verification = (
            await this.app.erp().getProduct().sku(skuAlias).execute()
        ).shouldSucceed();
        return new ThenGivenProduct(verification);
    }

    async country(countryAlias: string): Promise<ThenGivenCountryPort> {
        await this.ensureSetup();
        const verification = (
            await this.app.tax().getTaxRate().country(countryAlias).execute()
        ).shouldSucceed();
        return new ThenGivenCountry(verification);
    }
}

class ThenGivenClock implements ThenGivenClockPort {
    constructor(private readonly verification: GetTimeVerification) {}

    hasTime(time: string): ThenGivenClockPort;
    hasTime(): ThenGivenClockPort;
    hasTime(time?: string): ThenGivenClockPort {
        if (time !== undefined) {
            this.verification.time(time);
        } else {
            this.verification.timeIsNotNull();
        }
        return this;
    }
}

class ThenGivenProduct implements ThenGivenProductPort {
    constructor(private readonly verification: GetProductVerification) {}

    hasSku(sku: string): ThenGivenProductPort {
        this.verification.sku(sku);
        return this;
    }

    hasPrice(price: number): ThenGivenProductPort {
        this.verification.price(price.toString());
        return this;
    }
}

class ThenGivenCountry implements ThenGivenCountryPort {
    constructor(private readonly verification: GetTaxVerification) {}

    hasCountry(country: string): ThenGivenCountryPort {
        this.verification.country(country);
        return this;
    }

    hasTaxRate(taxRate: number): ThenGivenCountryPort {
        this.verification.taxRate(taxRate);
        return this;
    }

    hasTaxRateIsPositive(): ThenGivenCountryPort {
        this.verification.taxRateIsPositive();
        return this;
    }
}
