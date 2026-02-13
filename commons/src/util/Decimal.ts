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

    /**
     * Deserialize from JSON: accepts number or string (e.g. from JSON.parse).
     * Use when mapping API responses to types that have Decimal fields.
     */
    static fromJson(value: unknown): Decimal {
        if (typeof value === 'number') return Decimal.fromNumber(value);
        if (typeof value === 'string') return Decimal.fromString(value);
        throw new TypeError(`Decimal.fromJson expects number or string, got ${typeof value}`);
    }

    toNumber(): number {
        return this.value.toNumber();
    }

    toString(): string {
        return this.value.toString();
    }

    /**
     * For JSON.stringify: serializes as number so API payloads work without custom replacers.
     * Use Decimal.fromJson when deserializing.
     */
    toJSON(): number {
        return this.value.toNumber();
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
