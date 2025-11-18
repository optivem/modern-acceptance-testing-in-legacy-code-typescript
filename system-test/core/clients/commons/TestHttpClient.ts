import { APIRequestContext } from '@playwright/test';

export class TestHttpClient {
  private readonly baseUrl: string;
  private readonly requestContext: APIRequestContext;

  constructor(requestContext: APIRequestContext, baseUrl: string) {
    this.requestContext = requestContext;
    this.baseUrl = baseUrl;
  }

  async get(path: string) {
    const url = this.getUrl(path);
    return await this.requestContext.get(url);
  }

  async post(path: string, requestBody?: any) {
    const url = this.getUrl(path);
    return await this.requestContext.post(url, {
      data: requestBody,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  assertOk(response: any) {
    this.assertStatus(response, 200);
  }

  assertCreated(response: any) {
    this.assertStatus(response, 201);
  }

  assertNoContent(response: any) {
    this.assertStatus(response, 204);
  }

  assertUnprocessableEntity(response: any) {
    this.assertStatus(response, 422);
  }

  private assertStatus(response: any, expectedStatus: number) {
    if (response.status() !== expectedStatus) {
      throw new Error(
        `Expected status ${expectedStatus} but got ${response.status()}. Response body: ${JSON.stringify(response.body())}`
      );
    }
  }

  private getUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  async readBody<T>(response: any): Promise<T> {
    return await response.json();
  }
}
