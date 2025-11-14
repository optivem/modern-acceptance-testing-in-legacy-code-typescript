import { test, expect } from '@playwright/test';

test('echo should return 200 OK', async ({ request }) => {
  const response = await request.get('/api/echo');
  expect(response.status()).toBe(200);
});
