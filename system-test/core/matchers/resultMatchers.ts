import { expect } from '@playwright/test';
import type { Result } from '../drivers/commons/Result.js';

export function setupResultMatchers() {
  expect.extend({
    toBeSuccess<T>(received: Result<T>) {
      const pass = received.isSuccess();
      
      if (pass) {
        return {
          pass: true,
          message: () => 'Expected result to be failure but was success'
        };
      } else {
        const errors = received.getErrorMessages().join(', ');
        return {
          pass: false,
          message: () => `Expected result to be success but was failure with errors: ${errors}`
        };
      }
    },

    toBeFailureWith<T>(received: Result<T>, expectedMessage: string) {
      const isFailure = received.isFailure();
      
      if (!isFailure) {
        return {
          pass: false,
          message: () => `Expected result to be failure but was success`
        };
      }
      
      const errorMessages = received.getErrorMessages();
      const hasMessage = errorMessages.includes(expectedMessage);
      
      if (hasMessage) {
        return {
          pass: true,
          message: () => `Expected result not to be failure with message "${expectedMessage}"`
        };
      } else {
        return {
          pass: false,
          message: () => `Expected result to be failure with message "${expectedMessage}" but got: ${errorMessages.join(', ')}`
        };
      }
    }
  });
}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeSuccess(): R;
      toBeFailureWith(expectedMessage: string): R;
    }
  }
}
