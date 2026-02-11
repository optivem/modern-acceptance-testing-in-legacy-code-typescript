import { expect } from '@playwright/test';
import type { Result } from './Result.js';

function formatError(error: unknown): string {
  if (error === null || error === undefined) {
    return 'unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (Array.isArray(error)) {
    return error.join(', ');
  }
  if (typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return JSON.stringify(error);
}

function getErrorMessages(error: unknown): string[] {
  if (error === null || error === undefined) {
    return [];
  }
  if (typeof error === 'string') {
    return [error];
  }
  if (Array.isArray(error)) {
    return error.map(e => typeof e === 'string' ? e : JSON.stringify(e));
  }
  if (typeof error === 'object' && 'message' in error) {
    const messages = [String((error as { message: unknown }).message)];
    if ('fields' in error && Array.isArray((error as { fields: unknown[] }).fields)) {
      const fields = (error as { fields: { field: string; message: string }[] }).fields;
      for (const field of fields) {
        messages.push(`${field.field}: ${field.message}`);
      }
    }
    return messages;
  }
  return [JSON.stringify(error)];
}

/**
 * Registers custom Result matchers on expect() (e.g. toBeSuccess, toBeFailureWith, toHaveErrorMessage, toHaveFieldError).
 */
export function setupResultMatchers() {
  expect.extend({
    toBeSuccess<T, E>(received: Result<T, E>) {
      const pass = received.isSuccess();

      if (pass) {
        return {
          pass: true,
          message: () => 'Expected result to be failure but was success'
        };
      } else {
        const error = received.getError();
        return {
          pass: false,
          message: () => `Expected result to be success but was failure with error: ${formatError(error)}`
        };
      }
    },

    toBeFailureWith<T, E>(received: Result<T, E>, expectedMessage: string) {
      const isFailure = received.isFailure();

      if (!isFailure) {
        return {
          pass: false,
          message: () => `Expected result to be failure but was success`
        };
      }

      const errorMessages = getErrorMessages(received.getError());
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

    toHaveErrorMessage<T, E>(received: Result<T, E>, expectedMessage: string) {
      const isFailure = received.isFailure();

      if (!isFailure) {
        return {
          pass: false,
          message: () => `Expected result to be failure but was success`
        };
      }

      const errorMessages = getErrorMessages(received.getError());
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

    toHaveFieldError<T, E>(received: Result<T, E>, expectedMessage: string) {
      const isFailure = received.isFailure();

      if (!isFailure) {
        return {
          pass: false,
          message: () => `Expected result to be failure but was success`
        };
      }

      const errorMessages = getErrorMessages(received.getError());
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
