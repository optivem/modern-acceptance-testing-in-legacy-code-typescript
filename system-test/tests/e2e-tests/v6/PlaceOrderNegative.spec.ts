/**
 * V6 e2e: place order negative (matches reference PlaceOrderNegativeTest).
 */
import '../../../setup-config.js';
import { Channel } from './fixtures.js';
import { ChannelType } from '@optivem/core/shop/ChannelType.js';

const validationError = 'The request contains one or more validation errors';

Channel(ChannelType.UI, ChannelType.API)('should reject order with invalid quantity', async ({ scenario }) => {
    const whenClause = await scenario.given().product().when();
    const failure = await whenClause.placeOrder().withQuantity('invalid-quantity').then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must be an integer');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with non-existent SKU', async ({ scenario }) => {
    const failure = await scenario.when().placeOrder().withSku('NON-EXISTENT-SKU-12345').then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with negative quantity', async ({ scenario }) => {
    const failure = await scenario.when().placeOrder().withQuantity(-10).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must be positive');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with zero quantity', async ({ scenario }) => {
    const failure = await scenario.when().placeOrder().withQuantity(0).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must be positive');
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty SKU', async ({ scenario }) => {
    for (const sku of ['', '   ']) {
        const failure = await scenario.when().placeOrder().withSku(sku).then().shouldFail();
        failure.errorMessage(validationError).fieldErrorMessage('sku', 'SKU must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty quantity', async ({ scenario }) => {
    for (const emptyQuantity of ['', '   ']) {
        const failure = await scenario.when().placeOrder().withQuantity(emptyQuantity).then().shouldFail();
        failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with non-integer quantity', async ({ scenario }) => {
    for (const nonIntegerQuantity of ['3.5', 'lala']) {
        const failure = await scenario.when().placeOrder().withQuantity(nonIntegerQuantity).then().shouldFail();
        failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must be an integer');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with empty country', async ({ scenario }) => {
    for (const emptyCountry of ['', '   ']) {
        const failure = await scenario.when().placeOrder().withCountry(emptyCountry).then().shouldFail();
        failure.errorMessage(validationError).fieldErrorMessage('country', 'Country must not be empty');
    }
});

Channel(ChannelType.UI, ChannelType.API)('should reject order with invalid country', async ({ scenario }) => {
    const whenClause = await scenario.given().product().when();
    const failure = await whenClause.placeOrder().withCountry('XX').then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('country', 'Country does not exist: XX');
});

Channel(ChannelType.API)('should reject order with null quantity', async ({ scenario }) => {
    const failure = await scenario.when().placeOrder().withQuantity(null as unknown as string).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('quantity', 'Quantity must not be empty');
});

Channel(ChannelType.API)('should reject order with null SKU', async ({ scenario }) => {
    const failure = await scenario.when().placeOrder().withSku(null as unknown as string).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('sku', 'SKU must not be empty');
});

Channel(ChannelType.API)('should reject order with null country', async ({ scenario }) => {
    const failure = await scenario.when().placeOrder().withCountry(null as unknown as string).then().shouldFail();
    failure.errorMessage(validationError).fieldErrorMessage('country', 'Country must not be empty');
});
