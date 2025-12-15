import { Context } from './Context';

export abstract class BaseSuccessVerification<TResponse> {
  protected readonly response: TResponse;
  protected readonly context: Context;

  protected constructor(response: TResponse, context: Context) {
    this.response = response;
    this.context = context;
  }
}
