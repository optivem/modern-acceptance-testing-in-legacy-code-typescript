/**
 * V6 e2e: place order negative (matches reference PlaceOrderNegativeTest).
 */
import '../../../setup-config.js';
import { Channel } from './base/fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

const validationError = 'The request contains one or more validation errors';

Channel(ChannelType.UI, ChannelType.API)('should reject order with invalid quantity', async ({ scenario }) => {
    await scenario
        .given().product()
        .when().placeOrder()
            .withQuantity('invalid-quantity')
        .then().shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must be an integer');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with non-existent SKU', async ({ scenario }) => {
    await scenario
        .when().placeOrder()
            .withSku('NON-EXISTENT-SKU-12345')
        .then().shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with negative quantity', async ({ scenario }) => {
    await scenario
        .when().placeOrder()
            .withQuantity(-10)
        .then().shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must be positive');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with zero quantity', async ({ scenario }) => {
    await scenario
        .when().placeOrder()
            .withQuantity(0)
        .then().shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must be positive');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty SKU', async ({ scenario }) => {
    for (const sku of ['', '   ']) {
        await scenario
            .when().placeOrder()
                .withSku(sku)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('sku', 'SKU must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty quantity', async ({ scenario }) => {
    for (const emptyQuantity of ['', '   ']) {
        await scenario
            .when().placeOrder()
                .withQuantity(emptyQuantity)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with non-integer quantity', async ({ scenario }) => {
    for (const nonIntegerQuantity of ['3.5', 'lala']) {
        await scenario
            .when().placeOrder()
                .withQuantity(nonIntegerQuantity)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must be an integer');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty country', async ({ scenario }) => {
    for (const emptyCountry of ['', '   ']) {
        await scenario
            .when().placeOrder()
                .withCountry(emptyCountry)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('country', 'Country must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with invalid country', async ({ scenario }) => {
    await scenario
        .given().product()
        .when().placeOrder()
            .withCountry('XX')
        .then().shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('country', 'Country does not exist: XX');
});

Channel(ChannelType.API)('should reject order with null quantity', async ({ scenario }) => {
    await scenario
        .when().placeOrder()
            .withQuantity(null as unknown as string)
        .then().shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must not be empty');
});

Channel(ChannelType.API)('should reject order with null SKU', async ({ scenario }) => {
    await scenario
        .when().placeOrder()
            .withSku(null as unknown as string)
        .then().shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('sku', 'SKU must not be empty');
});

Channel(ChannelType.API)('should reject order with null country', async ({ scenario }) => {
    await scenario
        .when().placeOrder()
            .withCountry(null as unknown as string)
        .then().shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('country', 'Country must not be empty');
});
