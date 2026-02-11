import { Result } from '../util/index.js';
import { UseCaseContext } from './UseCaseContext.js';

export class UseCaseResult<
  TSuccessResponse,
  TFailureResponse = unknown,
  TContext = UseCaseContext,
  TSuccessVerification = unknown,
  TFailureVerification = unknown
> {
  private readonly result: Result<TSuccessResponse, TFailureResponse>;
  private readonly context: TContext;
  private readonly verificationFactory: (response: TSuccessResponse, context: TContext) => TSuccessVerification;
  private readonly failureVerificationFactory?: (error: TFailureResponse, context: TContext) => TFailureVerification;

  constructor(
    result: Result<TSuccessResponse, TFailureResponse>,
    context: TContext,
    verificationFactory: (response: TSuccessResponse, context: TContext) => TSuccessVerification,
    failureVerificationFactory?: (error: TFailureResponse, context: TContext) => TFailureVerification
  ) {
    this.result = result;
    this.context = context;
    this.verificationFactory = verificationFactory;
    this.failureVerificationFactory = failureVerificationFactory;
  }

  shouldSucceed(): TSuccessVerification {
    if (!this.result.isSuccess()) {
      const error = this.result.getError();
      throw new Error(`Expected result to be success but was failure with error: ${JSON.stringify(error)}`);
    }
    return this.verificationFactory(this.result.getValue()!, this.context);
  }

  shouldFail(): TFailureVerification {
    if (!this.result.isFailure()) {
      throw new Error('Expected result to be failure but was success');
    }
    if (!this.failureVerificationFactory) {
      throw new Error('Failure verification not configured for this use case');
    }
    return this.failureVerificationFactory(this.result.getError()!, this.context);
  }
}
