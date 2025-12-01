import { TestHttpClient } from '../../../commons/clients/TestHttpClient.js';

export class TaxApiDriver {
    private readonly httpClient: TestHttpClient;

    constructor(baseUrl: string) {
        this.httpClient = new TestHttpClient(baseUrl);
    }

    close(): void {
        // Cleanup if needed
    }

    // Add Tax API methods here as needed
}
