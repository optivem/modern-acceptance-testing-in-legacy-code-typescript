# @optivem/playwright

Playwright utilities for simplified page interactions.

## Installation

```bash
npm install @optivem/playwright
```

## Usage

```typescript
import { PageGateway } from '@optivem/playwright';
import { test } from '@playwright/test';

test('should fill form', async ({ page }) => {
  const gateway = new PageGateway(page, 'http://localhost:3000');
  
  await gateway.fill('#username', 'john');
  await gateway.click('#submit');
  const message = await gateway.readTextContent('#success');
});
```

## Features

- **PageGateway**: High-level wrapper for Playwright Page
  - Simplified form filling, clicking, reading values
  - Built-in waiting and timeout handling
  - Currency and percentage parsing utilities

## License

MIT
