import { expect } from '@playwright/test';
import type { Result } from '@optivem/lang';

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
      const hasMessage = errorMessages.some(msg => msg.includes(expectedMessage));
      
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
    },

    toHaveErrorMessage<T>(received: Result<T>, expectedMessage: string) {
      const isFailure = received.isFailure();
      
      if (!isFailure) {
        return {
          pass: false,
          message: () => `Expected result to be failure but was success`
        };
      }
      
      const errorMessages = received.getErrorMessages();
      const hasMessage = errorMessages.some(msg => msg.includes(expectedMessage));
      
      if (hasMessage) {
        return {
          pass: true,
          message: () => `Expected result not to have error message "${expectedMessage}"`
        };
      } else {
        return {
          pass: false,
          message: () => `Expected result to have error message "${expectedMessage}" but got: ${errorMessages.join(', ')}`
        };
      }
    },

    toHaveFieldError<T>(received: Result<T>, expectedMessage: string) {
      const isFailure = received.isFailure();
      
      if (!isFailure) {
        return {
          pass: false,
          message: () => `Expected result to be failure but was success`
        };
      }
      
      const errorMessages = received.getErrorMessages();
      const hasMessage = errorMessages.some(msg => msg.includes(expectedMessage));
      
      if (hasMessage) {
        return {
          pass: true,
          message: () => `Expected result not to have field error "${expectedMessage}"`
        };
      } else {
        return {
          pass: false,
          message: () => `Expected result to have field error "${expectedMessage}" but got: ${errorMessages.join(', ')}`
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
      toHaveErrorMessage(expectedMessage: string): R;
      toHaveFieldError(expectedMessage: string): R;
    }
  }
}
