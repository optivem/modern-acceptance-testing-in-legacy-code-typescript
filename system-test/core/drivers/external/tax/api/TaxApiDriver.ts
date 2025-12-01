import { TestHttpClient } from '../../../commons/clients/TestHttpClient.js';
import { Result } from '../../../commons/Result.js';
import { TestHttpUtils } from '../../../commons/clients/TestHttpUtils.js';

export class TaxApiDriver {
    private readonly httpClient: TestHttpClient;

    constructor(baseUrl: string) {
        this.httpClient = new TestHttpClient(baseUrl);
    }

    async checkHome(): Promise<Result<void>> {
        const response = await this.httpClient.get('/health');
        return TestHttpUtils.getOkResultOrFailure(response);
    }

    close(): void {
        // Cleanup if needed
    }
}
