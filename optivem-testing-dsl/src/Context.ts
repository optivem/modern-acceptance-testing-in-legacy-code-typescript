export class Context {
    private readonly paramMap: Map<string, string>;
    private readonly resultMap: Map<string, string>;

    constructor() {
        this.paramMap = new Map<string, string>();
        this.resultMap = new Map<string, string>();
    }

    getParamValue(alias: string): string {
        if (!alias || alias.trim().length === 0) {
            return alias;
        }

        if (this.paramMap.has(alias)) {
            return this.paramMap.get(alias)!;
        }

        const value = this.generateParamValue(alias);
        this.paramMap.set(alias, value);

        return value;
    }

    setResultEntry(alias: string, value: string): void {
        if (this.resultMap.has(alias)) {
            throw new Error(`Alias already exists: ${alias}`);
        }

        this.resultMap.set(alias, value);
    }

    getResultValue(alias: string): string {
        const value = this.resultMap.get(alias);
        if (!value) {
            return alias; // Return literal value if not found as alias
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
        const suffix = this.generateUUID().substring(0, 8);
        return `${alias}-${suffix}`;
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
