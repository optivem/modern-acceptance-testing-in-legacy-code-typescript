import { Result } from '../../../commons/Result.js';
import { TaxApiClient } from './client/TaxApiClient.js';

export class TaxApiDriver {
    private readonly apiClient: TaxApiClient;

    constructor(baseUrl: string) {
        this.apiClient = new TaxApiClient(baseUrl);
    }

    async checkHome(): Promise<Result<void>> {
        return this.apiClient.health().checkHealth();
    }

    close(): void {
        this.apiClient.close();
    }
}
