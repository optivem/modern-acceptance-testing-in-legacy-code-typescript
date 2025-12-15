import { Result } from '@optivem/lang';
import { Context } from './Context';

export class FailureVerification {
  private readonly result: Result<any>;
  private readonly context: Context;

  constructor(result: Result<any>, context: Context) {
    this.result = result;
    this.context = context;
  }

  errorMessage(expectedMessage: string): FailureVerification {
    const expandedExpectedMessage = this.context.expandAliases(expectedMessage);
    const errorMessages = this.result.getErrorMessages();
    const actualMessage = errorMessages.join(', ');
    
    if (actualMessage !== expandedExpectedMessage) {
      throw new Error(`Expected error message: '${expandedExpectedMessage}', but got: '${actualMessage}'`);
    }
    
    return this;
  }

  fieldErrorMessage(expectedField: string, expectedMessage: string): FailureVerification {
    const expandedExpectedField = this.context.expandAliases(expectedField);
    const expandedExpectedMessage = this.context.expandAliases(expectedMessage);
    const errorMessages = this.result.getErrorMessages();
    
    // For now, simple implementation - can be enhanced to parse field errors
    const fullExpectedMessage = `${expandedExpectedField}: ${expandedExpectedMessage}`;
    const actualMessage = errorMessages.join(', ');
    
    if (!actualMessage.includes(expandedExpectedMessage)) {
      throw new Error(`Expected field error message for field '${expandedExpectedField}': '${expandedExpectedMessage}', but got: '${actualMessage}'`);
    }
    
    return this;
  }
}
