/**
 * V5 e2e: place order negative (app/SystemDsl style).
 */
import '../../../setup-config.js';
import { Channel } from './base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';
import { GherkinDefaults } from '@optivem/dsl/gherkin/GherkinDefaults.js';
import { emptyArgumentsProvider } from '../../shared/argumentProviders.js';

const validationError = 'The request contains one or more validation errors';

Channel(ChannelType.UI, ChannelType.API)('should reject order with invalid quantity', async ({ app }) => {
    (await app.shop().placeOrder()
        .sku(GherkinDefaults.DEFAULT_SKU)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .quantity('invalid-quantity')
        .execute())
        .shouldFail()
        .errorMessage(validationError)
        .fieldErrorMessage('quantity', 'Quantity must be an integer');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with non-existent SKU', async ({ app }) => {
    (await app.shop().placeOrder()
        .sku('NON-EXISTENT-SKU-12345')
        .quantity(GherkinDefaults.DEFAULT_QUANTITY)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .execute())
        .shouldFail()
        .errorMessage(validationError)
        .fieldErrorMessage('sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with negative quantity', async ({ app }) => {
    (await app.shop().placeOrder()
        .sku(GherkinDefaults.DEFAULT_SKU)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .quantity(-10)
        .execute())
        .shouldFail()
        .errorMessage(validationError)
        .fieldErrorMessage('quantity', 'Quantity must be positive');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with zero quantity', async ({ app }) => {
    (await app.shop().placeOrder()
        .sku('ANOTHER-SKU-67890')
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .quantity(0)
        .execute())
        .shouldFail()
        .errorMessage(validationError)
        .fieldErrorMessage('quantity', 'Quantity must be positive');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty SKU', async ({ app }) => {
    for (const sku of emptyArgumentsProvider) {
        (await app.shop().placeOrder()
            .sku(sku)
            .quantity(GherkinDefaults.DEFAULT_QUANTITY)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('sku', 'SKU must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty quantity', async ({ app }) => {
    for (const emptyQuantity of emptyArgumentsProvider) {
        (await app.shop().placeOrder()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(emptyQuantity)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with non-integer quantity', async ({ app }) => {
    for (const nonIntegerQuantity of ['3.5', 'lala']) {
        (await app.shop().placeOrder()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(nonIntegerQuantity)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must be an integer');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty country', async ({ app }) => {
    for (const emptyCountry of emptyArgumentsProvider) {
        (await app.shop().placeOrder()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .quantity(GherkinDefaults.DEFAULT_QUANTITY)
            .country(emptyCountry)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('country', 'Country must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with invalid country', async ({ app }) => {
    (await app.erp().returnsProduct()
        .sku(GherkinDefaults.DEFAULT_SKU)
        .execute())
        .shouldSucceed();

    (await app.shop().placeOrder()
        .sku(GherkinDefaults.DEFAULT_SKU)
        .quantity(GherkinDefaults.DEFAULT_QUANTITY)
        .country('XX')
        .execute())
        .shouldFail()
        .errorMessage(validationError)
        .fieldErrorMessage('country', 'Country does not exist: XX');
});

Channel(ChannelType.API)('should reject order with null quantity', async ({ app }) => {
    (await app.shop().placeOrder()
        .sku(GherkinDefaults.DEFAULT_SKU)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .quantity(null)
        .execute())
        .shouldFail()
        .errorMessage(validationError)
        .fieldErrorMessage('quantity', 'Quantity must not be empty');
});

Channel(ChannelType.API)('should reject order with null SKU', async ({ app }) => {
    (await app.shop().placeOrder()
        .sku(null)
        .quantity(GherkinDefaults.DEFAULT_QUANTITY)
        .country(GherkinDefaults.DEFAULT_COUNTRY)
        .execute())
        .shouldFail()
        .errorMessage(validationError)
        .fieldErrorMessage('sku', 'SKU must not be empty');
});

Channel(ChannelType.API)('should reject order with null country', async ({ app }) => {
    (await app.shop().placeOrder()
        .sku(GherkinDefaults.DEFAULT_SKU)
        .quantity(GherkinDefaults.DEFAULT_QUANTITY)
        .country(null)
        .execute())
        .shouldFail()
        .errorMessage(validationError)
        .fieldErrorMessage('country', 'Country must not be empty');
});
