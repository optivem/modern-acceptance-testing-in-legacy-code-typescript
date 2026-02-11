import { ExternalSystemMode } from './ExternalSystemMode.js';

export class UseCaseContext {
    private readonly externalSystemMode: ExternalSystemMode;
    private readonly paramMap: Map<string, string>;
    private readonly resultMap: Map<string, string>;

    /**
     * @param externalSystemMode - STUB = parameterized/generated values, REAL = literal values.
     * TODO (backward compatibility): Optional default to REAL so existing `new Context()` / `new UseCaseContext()` keep working.
     * Prefer passing explicit ExternalSystemMode from config (e.g. SystemConfiguration) to align with Java/.NET.
     */
    constructor(externalSystemMode?: ExternalSystemMode) {
        this.externalSystemMode = externalSystemMode ?? ExternalSystemMode.REAL;
        this.paramMap = new Map<string, string>();
        this.resultMap = new Map<string, string>();
    }

    getExternalSystemMode(): ExternalSystemMode {
        return this.externalSystemMode;
    }

    getParamValue(alias: string): string {
        if (this.isNullOrBlank(alias)) {
            return alias;
        }

        if (this.paramMap.has(alias)) {
            return this.paramMap.get(alias)!;
        }

        const value = this.generateParamValue(alias);
        this.paramMap.set(alias, value);

        return value;
    }

    /**
     * STUB: return getParamValue(alias). REAL: return alias as literal.
     * Aligns with Java getParamValueOrLiteral / .NET GetParamValueOrLiteral.
     */
    getParamValueOrLiteral(alias: string): string {
        if (this.isNullOrBlank(alias)) {
            return alias;
        }
        switch (this.externalSystemMode) {
            case ExternalSystemMode.STUB:
                return this.getParamValue(alias);
            case ExternalSystemMode.REAL:
                return alias;
            default:
                throw new Error(`Unsupported external system mode: ${this.externalSystemMode}`);
        }
    }

    setResultEntry(alias: string, value: string): void {
        this.ensureAliasNotNullBlank(alias);

        if (this.resultMap.has(alias)) {
            throw new Error(`Alias already exists: ${alias}`);
        }

        this.resultMap.set(alias, value);
    }

    /** Aligns with Java setResultEntryFailed / .NET SetResultEntryFailed. */
    setResultEntryFailed(alias: string, errorMessage: string): void {
        this.ensureAliasNotNullBlank(alias);
        this.setResultEntry(alias, `FAILED: ${errorMessage}`);
    }

    getResultValue(alias: string): string {
        if (this.isNullOrBlank(alias)) {
            return alias;
        }

        const value = this.resultMap.get(alias);
        if (value === undefined) {
            return alias; // Return literal value if not found as alias
        }

        if (value.includes('FAILED')) {
            throw new Error(`Cannot get result value for alias '${alias}' because the operation failed: ${value}`);
        }

        return value;
    }

    expandAliases(message: string): string {
        let expandedMessage = this.expandAlias(message, this.paramMap);
        expandedMessage = this.expandAlias(expandedMessage, this.resultMap);
        return expandedMessage;
    }

    private expandAlias(message: string, map: Map<string, string>): string {
        let expandedMessage = message;
        for (const [alias, actualValue] of map.entries()) {
            expandedMessage = expandedMessage.replace(alias, actualValue);
        }
        return expandedMessage;
    }

    private generateParamValue(alias: string): string {
        this.ensureAliasNotNullBlank(alias);
        const suffix = this.generateUUID().substring(0, 8);
        return `${alias}-${suffix}`;
    }

    private ensureAliasNotNullBlank(alias: string): void {
        if (this.isNullOrBlank(alias)) {
            throw new Error('Alias cannot be null or blank');
        }
    }

    private isNullOrBlank(alias: string): boolean {
        return alias === undefined || alias === null || alias.trim().length === 0;
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// TODO (backward compatibility): alias so existing imports of Context still work. Prefer UseCaseContext.
export { UseCaseContext as Context };
