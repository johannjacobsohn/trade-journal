import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';

test.describe('Orders E2E', () => {
  test('should display orders table', async ({ page }) => {
    await page.goto(`${BASE_URL}/orders`);
    await expect(page.getByRole('heading', { name: /orders/i })).toBeVisible();
    await expect(page.getByText(/symbol/i)).toBeVisible();
  });

  test('should add a new order', async ({ page }) => {
    await page.goto(`${BASE_URL}/orders`);
    await page.getByRole('button', { name: /add order/i }).click();
    await page.getByPlaceholder('Symbol').fill('TSLA');
    await page.getByPlaceholder('Menge').fill('5');
    await page.getByPlaceholder('Preis').fill('123');
    await page.getByRole('combobox').selectOption('buy');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText('TSLA')).toBeVisible();
  });

  test('should filter orders by symbol', async ({ page }) => {
    await page.goto(`${BASE_URL}/orders`);
    await page.getByRole('button', { name: 'Filter' }).click();
    await page.getByPlaceholder('Symbol').fill('TSLA');
    await expect(page.getByText('TSLA')).toBeVisible();
  });

  test('should sort orders by price', async ({ page }) => {
    await page.goto(`${BASE_URL}/orders`);
    await page.getByRole('button', { name: 'Sort' }).click();
    await page.getByLabel(/sort by/i).selectOption('price');
  });
});
