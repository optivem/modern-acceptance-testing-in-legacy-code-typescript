# @optivem/testing-assertions

Custom Playwright test assertions for common testing patterns.

## Installation

```bash
npm install @optivem/testing-assertions
```

## Usage

```typescript
import { setupResultMatchers } from '@optivem/testing-assertions';

setupResultMatchers();

// Use custom matchers
expect(result).toBeSuccess();
expect(result).toBeFailureWith('Error message');
```
