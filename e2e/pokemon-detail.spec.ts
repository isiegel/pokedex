import { expect, test } from '@playwright/test';

test.describe('Pokémon detail page', () => {
  test('navigates to the detail page when a card is clicked', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('a[href^="/pokemon/"]').first().click();
    await expect(page).toHaveURL(/\/pokemon\/\d+/);
  });

  test('displays the Pokémon name as a heading', async ({ page }) => {
    await page.goto('/pokemon/1');
    await expect(page.getByRole('heading', { name: 'bulbasaur' })).toBeVisible();
  });

  test('displays the Pokédex number', async ({ page }) => {
    await page.goto('/pokemon/1');
    await expect(page.getByText('#001')).toBeVisible();
  });

  test('shows the stat bars section', async ({ page }) => {
    await page.goto('/pokemon/1');
    await expect(page.getByText('Base Stats')).toBeVisible();
  });

  test('shows the Info section with height and weight', async ({ page }) => {
    await page.goto('/pokemon/1');
    await expect(page.getByText('Height')).toBeVisible();
    await expect(page.getByText('Weight')).toBeVisible();
  });

  test('back link navigates to the home page', async ({ page }) => {
    await page.goto('/pokemon/1');
    await page.getByRole('link', { name: /back to pokédex/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('shows the Pokémon description text', async ({ page }) => {
    await page.goto('/pokemon/1');
    // any bulbasaur flavor text mentions a seed or plant
    await expect(page.getByText(/seed|plant|bulb/i).first()).toBeVisible();
  });

  test('shows the Gender field with a readable value', async ({ page }) => {
    await page.goto('/pokemon/1');
    await expect(page.getByText('Gender')).toBeVisible();
    // bulbasaur gender_rate is 1 → 87.5% male / 12.5% female
    await expect(page.getByText('87.5% male / 12.5% female')).toBeVisible();
  });

  test('shows a 404 page for an invalid Pokémon ID', async ({ page }) => {
    await page.goto('/pokemon/999999');
    // getByRole avoids matching the Next.js route announcer which also
    // contains this string (as the page title broadcast to screen readers)
    await expect(
      page.getByRole('heading', { name: 'Pokémon not found' }),
    ).toBeVisible();
  });
});
