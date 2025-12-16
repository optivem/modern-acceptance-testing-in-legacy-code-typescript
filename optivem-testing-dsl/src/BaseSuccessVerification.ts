import { UseCaseContext } from './Context.js';

export class ResponseVerification<TResponse, TContext = UseCaseContext> {
  protected readonly response: TResponse;
  protected readonly context: TContext;

  constructor(response: TResponse, context: TContext) {
    this.response = response;
    this.context = context;
  }

  getResponse(): TResponse {
    return this.response;
  }

  getContext(): TContext {
    return this.context;
  }
}

// Backward compatibility alias
export { ResponseVerification as BaseSuccessVerification };
