import { ResponseVerification } from './BaseSuccessVerification.js';
import { UseCaseContext } from './Context.js';

export class VoidVerification<TContext = UseCaseContext> extends ResponseVerification<void, TContext> {
  constructor(response: void, context: TContext) {
    super(response, context);
  }
}
