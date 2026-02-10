# @optivem/http

HTTP client utilities for testing with TypeScript and Axios.

## Installation

```bash
npm install @optivem/http
```

## Usage

```typescript
import { HttpClientFactory, HttpGateway, HttpUtils } from '@optivem/http';

// Create HTTP client
const client = HttpClientFactory.create('http://localhost:8080');
const gateway = new HttpGateway(client, 'http://localhost:8080');

// Make requests
const response = await gateway.post('/api/orders', { sku: 'ABC' });
const result = HttpUtils.getCreatedResultOrFailure(response);

if (result.isSuccess) {
  console.log('Order created:', result.value);
} else {
  console.error('Errors:', result.errors);
}
```

## Features

- **HttpClientFactory**: Create pre-configured Axios instances
- **HttpGateway**: Simplified HTTP methods (get, post, put, delete)
- **HttpUtils**: Convert HTTP responses to Result objects
- **ProblemDetails support**: Automatically parse RFC 7807 Problem Details

## License

MIT
