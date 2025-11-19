import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

export class TestHttpClient {
  private readonly httpClient: AxiosInstance;

  constructor(baseUrl: string) {
    this.httpClient = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true, // Don't throw on any status code, we'll handle it ourselves
    });
  }

  async get(path: string): Promise<AxiosResponse> {
    return await this.httpClient.get(path);
  }

  async post(path: string, requestBody?: any): Promise<AxiosResponse> {
    return await this.httpClient.post(path, requestBody);
  }

  assertOk(response: AxiosResponse): void {
    this.assertStatus(response, StatusCodes.OK);
  }

  assertCreated(response: AxiosResponse): void {
    this.assertStatus(response, StatusCodes.CREATED);
  }

  assertNoContent(response: AxiosResponse): void {
    this.assertStatus(response, StatusCodes.NO_CONTENT);
  }

  assertUnprocessableEntity(response: AxiosResponse): void {
    this.assertStatus(response, StatusCodes.UNPROCESSABLE_ENTITY);
  }

  private assertStatus(response: AxiosResponse, expectedStatus: number): void {
    if (response.status !== expectedStatus) {
      const bodyText = typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data);
      throw new Error(
        `Expected status ${expectedStatus} but got ${response.status}. Response body: ${bodyText}`
      );
    }
  }

  readBody<T>(response: AxiosResponse): T {
    return response.data;
  }
}
