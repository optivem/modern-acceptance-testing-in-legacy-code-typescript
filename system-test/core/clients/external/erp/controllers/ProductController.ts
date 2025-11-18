import { TestHttpClient } from '../../../commons/TestHttpClient';
import { CreateProductRequest } from '../dtos/CreateProductRequest';
import * as crypto from 'crypto';

export class ProductController {
  private static readonly ENDPOINT = '/products';
  private readonly httpClient: TestHttpClient;

  constructor(httpClient: TestHttpClient) {
    this.httpClient = httpClient;
  }

  async createProduct(baseSku: string, unitPrice: number): Promise<string> {
    const uniqueSku = `${baseSku}-${crypto.randomUUID()}`;
    const request = {
      sku: uniqueSku,
      price: unitPrice,
    };

    const response = await this.httpClient.post(ProductController.ENDPOINT, request);
    this.httpClient.assertCreated(response);

    return uniqueSku;
  }
}
