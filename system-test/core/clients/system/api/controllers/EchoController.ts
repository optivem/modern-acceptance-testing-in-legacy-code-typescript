import { TestHttpClient } from '../../../commons/TestHttpClient';
import { AxiosResponse } from 'axios';

export class EchoController {
  private static readonly ENDPOINT = '/echo';
  private readonly httpClient: TestHttpClient;

  constructor(httpClient: TestHttpClient) {
    this.httpClient = httpClient;
  }

  async echo(): Promise<AxiosResponse> {
    return await this.httpClient.get(EchoController.ENDPOINT);
  }

  async assertEchoSuccessful(response: AxiosResponse): Promise<void> {
    this.httpClient.assertOk(response);
  }
}
