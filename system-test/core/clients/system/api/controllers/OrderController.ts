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

  async placeOrder(sku: string, quantity: number | string, country: string): Promise<PlaceOrderResponse> {
    const request: PlaceOrderRequest = {
      sku,
      quantity: quantity === '' ? '' as any : Number(quantity),
      country,
    };
    return await this.httpClient.post(OrderController.ENDPOINT, request);
  }

  async assertOrderPlacedSuccessfully(response: any): Promise<PlaceOrderResponse> {
    await this.httpClient.assertCreated(response);
    return await this.httpClient.readBody<PlaceOrderResponse>(response);
  }

  async assertOrderPlacementFailed(response: any): Promise<void> {
    await this.httpClient.assertUnprocessableEntity(response);
  }

  async getErrorMessage(response: any): Promise<string> {
    return JSON.stringify(await response.json());
  }

  async viewOrder(orderNumber: string) {
    return await this.httpClient.get(`${OrderController.ENDPOINT}/${orderNumber}`);
  }

  async assertOrderViewedSuccessfully(response: any): Promise<GetOrderResponse> {
    await this.httpClient.assertOk(response);
    return await this.httpClient.readBody<GetOrderResponse>(response);
  }

  async cancelOrder(orderNumber: string) {
    return await this.httpClient.post(`${OrderController.ENDPOINT}/${orderNumber}/cancel`);
  }

  async assertOrderCancelledSuccessfully(response: any): Promise<void> {
    await this.httpClient.assertNoContent(response);
  }
}
