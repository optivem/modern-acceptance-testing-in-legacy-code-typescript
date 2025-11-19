import { TestHttpClient } from '../../../commons/TestHttpClient';
import { AxiosResponse } from 'axios';

export class HomeController {
  private static readonly ENDPOINT = '/';
  private readonly httpClient: TestHttpClient;

  constructor(httpClient: TestHttpClient) {
    this.httpClient = httpClient;
  }

  async getHome(): Promise<AxiosResponse<string>> {
    return await this.httpClient.get(HomeController.ENDPOINT);
  }

  assertGetHomeSuccessful(response: AxiosResponse<string>): void {
    this.httpClient.assertOk(response);
  }
}
