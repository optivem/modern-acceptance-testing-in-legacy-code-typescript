import { UseCaseContext } from './Context.js';
import { ResponseVerification } from './BaseSuccessVerification.js';

export class FailureVerification<TError = unknown, TContext = UseCaseContext> extends ResponseVerification<TError, TContext> {
  constructor(error: TError, context: TContext) {
    super(error, context);
  }

  // Helper method to get the error (alias for getResponse for clarity)
  getError(): TError {
    return this.response;
  }
}
