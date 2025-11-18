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

  async assertOk(response: any) {
    await this.assertStatus(response, 200);
  }

  async assertCreated(response: any) {
    await this.assertStatus(response, 201);
  }

  async assertNoContent(response: any) {
    await this.assertStatus(response, 204);
  }

  async assertUnprocessableEntity(response: any) {
    await this.assertStatus(response, 422);
  }

  private async assertStatus(response: any, expectedStatus: number) {
    if (response.status() !== expectedStatus) {
      let bodyText = '';
      try {
        const body = await response.json();
        bodyText = JSON.stringify(body);
      } catch {
        bodyText = await response.text();
      }
      throw new Error(
        `Expected status ${expectedStatus} but got ${response.status()}. Response body: ${bodyText}`
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
