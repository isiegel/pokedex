import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  const text = 'Get more!';

  test('displays the Pokédex heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Pokédex' })).toBeVisible();
  });

  test('renders 20 Pokémon cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('a[href^="/pokemon/"]');
    await expect(cards).toHaveCount(20);
  });

  test('each card shows a name and Pokédex number', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('a[href^="/pokemon/"]').first();
    await expect(firstCard.locator('text=/#\\d{3}/')).toBeVisible();
    await expect(firstCard.locator('p')).toBeVisible();
  });

  test('shows the Refresh button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: text })).toBeVisible();
  });

  test('gender filter is preserved when navigating to a detail page and back', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href^="/pokemon/"]').first().waitFor();

    await page.getByLabel('Genderless').click();
    await expect(page).toHaveURL(/gender=genderless/);

    // navigate into a detail page via the card link (which carries the gender param)
    await page.locator('a[href^="/pokemon/"]').first().click();
    await expect(page).toHaveURL(/\/pokemon\/\d+/);
    await expect(page).toHaveURL(/gender=genderless/);

    await page.getByRole('link', { name: /back to pokédex/i }).click();
    await expect(page).toHaveURL(/gender=genderless/);
    await expect(page.getByLabel('Genderless')).toBeChecked();
  });

  test('Refresh button loads a new set of Pokémon', async ({ page }) => {
    await page.goto('/');

    const cards = page.locator('a[href^="/pokemon/"]');
    const before = await cards.evaluateAll((els) =>
      els.map((el) => el.getAttribute('href'))
    );

    await page.getByRole('button', {
      name: text
    }).click();

    await page.waitForLoadState('networkidle');
    const after = await cards.evaluateAll((els) =>
      els.map((el) => el.getAttribute('href'))
    );

    expect(before).not.toEqual(after);
  });
});
