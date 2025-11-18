import { TestHttpClient } from '../../../commons/TestHttpClient';
import { PlaceOrderRequest } from '../dtos/PlaceOrderRequest';
import { PlaceOrderResponse } from '../dtos/PlaceOrderResponse';
import { GetOrderResponse } from '../dtos/GetOrderResponse';
import { AxiosResponse } from 'axios';

export class OrderController {
  private static readonly ENDPOINT = '/orders';
  private readonly httpClient: TestHttpClient;

  constructor(httpClient: TestHttpClient) {
    this.httpClient = httpClient;
  }

  async placeOrder(sku: string, quantity: number | string, country: string): Promise<AxiosResponse> {
    const request: PlaceOrderRequest = {
      sku,
      quantity: quantity === '' ? '' as any : Number(quantity),
      country,
    };
    return await this.httpClient.post(OrderController.ENDPOINT, request);
  }

  async assertOrderPlacedSuccessfully(response: AxiosResponse): Promise<PlaceOrderResponse> {
    this.httpClient.assertCreated(response);
    return this.httpClient.readBody<PlaceOrderResponse>(response);
  }

  async assertOrderPlacementFailed(response: AxiosResponse): Promise<void> {
    this.httpClient.assertUnprocessableEntity(response);
  }

  async getErrorMessage(response: AxiosResponse): Promise<string> {
    return JSON.stringify(response.data);
  }

  async viewOrder(orderNumber: string): Promise<AxiosResponse> {
    return await this.httpClient.get(`${OrderController.ENDPOINT}/${orderNumber}`);
  }

  async assertOrderViewedSuccessfully(response: AxiosResponse): Promise<GetOrderResponse> {
    this.httpClient.assertOk(response);
    return this.httpClient.readBody<GetOrderResponse>(response);
  }

  async cancelOrder(orderNumber: string): Promise<AxiosResponse> {
    return await this.httpClient.post(`${OrderController.ENDPOINT}/${orderNumber}/cancel`);
  }

  async assertOrderCancelledSuccessfully(response: AxiosResponse): Promise<void> {
    this.httpClient.assertNoContent(response);
  }
}
