import { expect } from '@playwright/test';
import type { Result } from './Result.js';

/**
 * Recommended way to assert on a Result. Fluent API: throws if assertion fails.
 * Use in tests or any code that needs to assert success/failure.
 * @example assertThatResult(result).isSuccess()
 * @example assertThatResult(result).isFailure()
 * @example assertThatResult(result).isFailureWith('expected error message')
 */
export function assertThatResult<T, E>(actual: Result<T, E>): ResultAssertFluent<T, E> {
  return new ResultAssertFluent(actual);
}

class ResultAssertFluent<T, E> {
  constructor(private readonly actual: Result<T, E>) {}

  isSuccess(): this {
    if (this.actual == null) {
      throw new Error('Expected result not to be null');
    }
    if (!this.actual.isSuccess()) {
      throw new Error(`Expected result to be success but was failure with error: ${formatError(this.actual.getError())}`);
    }
    return this;
  }

  isFailure(): this {
    if (this.actual == null) {
      throw new Error('Expected result not to be null');
    }
    if (!this.actual.isFailure()) {
      throw new Error('Expected result to be failure but was success');
    }
    return this;
  }

  isFailureWith(expectedMessage: string): this {
    this.isFailure();
    const errorMessages = getErrorMessages(this.actual.getError());
    const hasMessage = errorMessages.some((msg) => msg.includes(expectedMessage));
    if (!hasMessage) {
      throw new Error(`Expected result to be failure with message "${expectedMessage}" but got: ${errorMessages.join(', ')}`);
    }
    return this;
  }
}

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
 * Registers custom Result matchers on expect() (toBeSuccess, toBeFailureWith, etc.).
 * Use when you prefer expect(result).toBeSuccess() in a test runner. Otherwise prefer assertThatResult(result).isSuccess().
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
