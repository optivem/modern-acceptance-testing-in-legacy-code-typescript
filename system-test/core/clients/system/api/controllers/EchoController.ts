import { TestHttpClient } from '../../../commons/TestHttpClient';

export class EchoController {
  private static readonly ENDPOINT = '/echo';
  private readonly httpClient: TestHttpClient;

  constructor(httpClient: TestHttpClient) {
    this.httpClient = httpClient;
  }

  async echo() {
    return await this.httpClient.get(EchoController.ENDPOINT);
  }

  assertEchoSuccessful(response: any): void {
    this.httpClient.assertOk(response);
  }
}
