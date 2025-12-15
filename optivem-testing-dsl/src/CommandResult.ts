import { Result } from '@optivem/lang';
import { Context } from './Context';
import { FailureVerification } from './FailureVerification';

export class CommandResult<TResponse, TVerification> {
  private readonly result: Result<TResponse>;
  private readonly context: Context;
  private readonly verificationFactory: (response: TResponse, context: Context) => TVerification;

  constructor(
    result: Result<TResponse>,
    context: Context,
    verificationFactory: (response: TResponse, context: Context) => TVerification
  ) {
    this.result = result;
    this.context = context;
    this.verificationFactory = verificationFactory;
  }

  shouldSucceed(): TVerification {
    if (!this.result.isSuccess()) {
      const errorMessages = this.result.getErrorMessages();
      throw new Error(`Expected result to be success but was failure with error: ${errorMessages.join(', ')}`);
    }
    return this.verificationFactory(this.result.getValue()!, this.context);
  }

  shouldFail(): FailureVerification {
    if (!this.result.isFailure()) {
      throw new Error('Expected result to be failure but was success');
    }
    return new FailureVerification(this.result, this.context);
  }
}
