# @optivem/playwright

Playwright utilities for simplified page interactions.

## Installation

```bash
npm install @optivem/playwright
```

## Usage

```typescript
import { PageClient } from '@optivem/playwright';
import { test } from '@playwright/test';

test('should fill form', async ({ page }) => {
  const pageClient = new PageClient(page, 'http://localhost:3000');
  
  await pageClient.fill('#username', 'john');
  await pageClient.click('#submit');
  const message = await pageClient.readTextContent('#success');
});
```

## Features

- **PageClient**: High-level wrapper for Playwright Page (alias `PageGateway` for backward compatibility)
  - Simplified form filling, clicking, reading values
  - Built-in waiting and timeout handling
  - Currency and percentage parsing utilities

## License

MIT
