# @optivem/results

Functional error handling with the Result type pattern.

## Installation

```bash
npm install @optivem/results
```

## Usage

```typescript
import { Result } from '@optivem/results';

// Success case
const success = Result.success({ id: 123, name: 'Product' });
if (success.isSuccess()) {
  console.log(success.getValue()); // { id: 123, name: 'Product' }
}

// Failure case
const failure = Result.failure(['Invalid input', 'Missing required field']);
if (failure.isFailure()) {
  console.log(failure.getErrorMessages()); // ['Invalid input', 'Missing required field']
}
```

## Features

- **Type-safe error handling**: No exceptions, explicit success/failure states
- **Immutable**: Result instances cannot be modified after creation
- **Fluent API**: Chain operations with `isSuccess()` and `isFailure()`
- **Multiple error messages**: Support for collecting multiple validation errors

## License

MIT
