import '../../../setup-config.js';
import { test } from './base/fixtures.js';
import { registerPlaceOrderNegativeBaseTests } from './PlaceOrderNegativeBase.js';

registerPlaceOrderNegativeBaseTests(test, { shopDriverFixture: 'shopUiDriver' });