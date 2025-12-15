import { BaseSuccessVerification } from './BaseSuccessVerification';
import { Context } from './Context';

export class VoidVerification extends BaseSuccessVerification<void> {
  constructor(response: void, context: Context) {
    super(response, context);
  }
}
