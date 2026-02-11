import Big from 'big.js';

/**
 * Wrapper over big.js for decimal arithmetic. Use this type everywhere instead of
 * depending on the library directly, so the implementation can be swapped later.
 */
export class Decimal {
    private readonly value: Big;

    private constructor(value: Big) {
        this.value = value;
    }

    static fromString(s: string): Decimal {
        return new Decimal(new Big(s));
    }

    static fromNumber(n: number): Decimal {
        return new Decimal(new Big(n));
    }

    toNumber(): number {
        return this.value.toNumber();
    }

    toString(): string {
        return this.value.toString();
    }

    eq(other: Decimal): boolean {
        return this.value.eq(other.value);
    }

    add(other: Decimal): Decimal {
        return new Decimal(this.value.plus(other.value));
    }

    sub(other: Decimal): Decimal {
        return new Decimal(this.value.minus(other.value));
    }

    mul(other: Decimal): Decimal {
        return new Decimal(this.value.times(other.value));
    }

    div(other: Decimal): Decimal {
        return new Decimal(this.value.div(other.value));
    }
}
