import { test, expect } from '@playwright/test';

test('home should return HTML content', async ({ page }) => {
  const response = await page.goto('/');
  
  expect(response?.status()).toBe(200);
  
  const contentType = response?.headers()['content-type'];
  expect(contentType).toContain('text/html');
  
  const pageContent = await page.content();
  expect(pageContent).toContain('<html');
  expect(pageContent).toContain('</html>');
});
