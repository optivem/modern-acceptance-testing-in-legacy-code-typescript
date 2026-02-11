import { ResponseVerification } from './ResponseVerification.js';
import { UseCaseContext } from './UseCaseContext.js';

export class VoidVerification<TContext = UseCaseContext> extends ResponseVerification<void, TContext> {
  constructor(response: void, context: TContext) {
    super(response, context);
  }
}
