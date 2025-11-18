import { TestHttpClient } from '../../../commons/TestHttpClient';
import { CreateProductResponse } from '../dtos/CreateProductResponse';

export class ProductController {
  private static readonly ENDPOINT = '/products';
  private readonly httpClient: TestHttpClient;

  constructor(httpClient: TestHttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Creates a product with a unique SKU based on the provided base SKU and returns the actual SKU.
   * The ERP system will append a unique identifier to ensure uniqueness.
   */
  async createProduct(baseSku: string, unitPrice: number): Promise<string> {
    const request = {
      sku: baseSku,
      price: unitPrice,
    };

    const response = await this.httpClient.post(ProductController.ENDPOINT, request);
    this.httpClient.assertCreated(response);
    
    const productResponse = await this.httpClient.readBody<CreateProductResponse>(response);
    return productResponse.sku;
  }
}
