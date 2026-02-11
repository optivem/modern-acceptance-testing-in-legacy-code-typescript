/**
 * Type/string conversion helpers. Aligns with Java (commons.util.Converter) and .NET (Commons.Util.Converter).
 */
export class Converter {
    private constructor() {}

    static toDecimal(value: string | null | undefined): number | null {
        return this.to(value, (s) => parseFloat(s));
    }

    static fromDecimal(value: number | null | undefined): string | null {
        return value == null ? null : String(value);
    }

    static toInteger(value: string | null | undefined, ...nullValues: string[]): number | null {
        if (value == null || value.trim() === '') return null;
        for (const nv of nullValues) {
            if (value.localeCompare(nv, undefined, { sensitivity: 'accent' }) === 0) return null;
        }
        return this.to(value, (s) => parseInt(s, 10));
    }

    static fromInteger(value: number | null | undefined): string | null {
        return value == null ? null : String(value);
    }

    static toDouble(value: string | null | undefined): number | null {
        return this.to(value, (s) => parseFloat(s));
    }

    static toInstant(value: string | null | undefined): Date | null {
        return this.to(value, (s) => new Date(s));
    }

    static fromInstant(value: Date | null | undefined): string | null {
        return value == null ? null : value.toISOString();
    }

    static parseInstant(text: string | null | undefined, ...nullValues: string[]): Date | null {
        if (text == null || text.trim() === '') return null;
        for (const nv of nullValues) {
            if (text.localeCompare(nv, undefined, { sensitivity: 'accent' }) === 0) return null;
        }
        const iso = Date.parse(text);
        if (!Number.isNaN(iso)) return new Date(iso);
        const localeFormats = [
            /(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)/i,
            /(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2}):(\d{2}):(\d{2})/,
            /(\d{4})-(\d{2})-(\d{2})\s*(\d{2}):(\d{2}):(\d{2})/,
        ];
        for (const _ of localeFormats) {
            const d = new Date(text);
            if (!Number.isNaN(d.getTime())) return d;
        }
        throw new Error(`Invalid date format: ${text} - Expected ISO format or locale-specific format.`);
    }

    private static to<T>(value: string | null | undefined, converter: (s: string) => T): T | null {
        if (value == null || value.trim() === '') return null;
        return converter(value);
    }
}
