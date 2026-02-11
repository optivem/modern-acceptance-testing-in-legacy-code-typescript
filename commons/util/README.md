# @optivem/util

Custom Playwright test assertions for common testing patterns.

## Installation

```bash
npm install @optivem/util
```

## Usage

```typescript
import { setupResultMatchers } from '@optivem/util';

setupResultMatchers();

// Use custom matchers
expect(result).toBeSuccess();
expect(result).toBeFailureWith('Error message');
```
