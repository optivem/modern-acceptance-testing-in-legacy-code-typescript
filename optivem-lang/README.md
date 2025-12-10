# @optivem/lang

Language utilities for resource management.

## Installation

```bash
npm install @optivem/lang
```

## Usage

```typescript
import { Closer } from '@optivem/lang';

const resource = await createResource();
await Closer.close(resource); // Safely closes if resource has close() method
```

## Features

- **Closer**: Safely close resources that implement a close() method
- **Error handling**: Catches and logs errors during resource cleanup

## License

MIT
