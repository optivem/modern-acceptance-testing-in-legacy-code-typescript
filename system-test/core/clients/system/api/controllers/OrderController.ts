import { TestHttpClient } from '../../../commons/TestHttpClient';
import { PlaceOrderRequest } from '../dtos/PlaceOrderRequest';
import { PlaceOrderResponse } from '../dtos/PlaceOrderResponse';
import { GetOrderResponse } from '../dtos/GetOrderResponse';

export class OrderController {
  private static readonly ENDPOINT = '/orders';
  private readonly httpClient: TestHttpClient;

  constructor(httpClient: TestHttpClient) {
    this.httpClient = httpClient;
  }

  async placeOrder(sku: string, quantity: string, country: string) {
    const request: PlaceOrderRequest = {
      sku,
      quantity,
      country,
    };
    return await this.httpClient.post(OrderController.ENDPOINT, request);
  }

  async assertOrderPlacedSuccessfully(response: any): Promise<PlaceOrderResponse> {
    this.httpClient.assertCreated(response);
    return await this.httpClient.readBody<PlaceOrderResponse>(response);
  }

  assertOrderPlacementFailed(response: any): void {
    this.httpClient.assertUnprocessableEntity(response);
  }

  async getErrorMessage(response: any): Promise<string> {
    return JSON.stringify(await response.json());
  }

  async viewOrder(orderNumber: string) {
    return await this.httpClient.get(`${OrderController.ENDPOINT}/${orderNumber}`);
  }

  async assertOrderViewedSuccessfully(response: any): Promise<GetOrderResponse> {
    this.httpClient.assertOk(response);
    return await this.httpClient.readBody<GetOrderResponse>(response);
  }

  async cancelOrder(orderNumber: string) {
    return await this.httpClient.post(`${OrderController.ENDPOINT}/${orderNumber}/cancel`);
  }

  assertOrderCancelledSuccessfully(response: any): void {
    this.httpClient.assertNoContent(response);
  }
}
