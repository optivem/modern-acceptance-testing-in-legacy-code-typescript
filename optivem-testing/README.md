# @optivem/optivem-testing

Multi-channel testing utilities for Playwright - run the same test against UI and API channels.

## Installation

```bash
npm install @optivem/optivem-testing
```

## Usage

```typescript
import { ChannelType, channelTest } from '@optivem/optivem-testing';
import { expect } from '@playwright/test';

const shopDriverFactory = (channelType: string) => {
  return channelType === ChannelType.UI 
    ? new ShopUiDriver()
    : new ShopApiDriver();
};

channelTest(
  [ChannelType.UI, ChannelType.API],
  shopDriverFactory,
  'shopDriver',
  {},
  'should place order successfully',
  async ({ shopDriver }) => {
    const result = await shopDriver.placeOrder('SKU-123', '5', 'US');
    expect(result.isSuccess()).toBe(true);
  }
);
```

## Features

- **ChannelType**: Enum for UI and API channels
- **channelTest**: Run the same test across multiple channels (UI, API)
- **Automatic resource cleanup**: Uses Closer to clean up drivers after tests

Inspired by .NET's `[Theory]` and `[ChannelData]` attributes.

## License

MIT
