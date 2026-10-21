import { test, expect } from '../fixtures/test';

test.describe('Inventory', () => {
  test('shows 6 products @smoke', async ({ loggedIn }) => {
    await expect(loggedIn.items).toHaveCount(6);
  });

  test('sort by price low → high', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high → low', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sort by name Z → A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.itemNames.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('add and remove updates the cart badge', async ({ loggedIn }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Bike Light');
    await expect(loggedIn.cartBadge).toHaveText('2');

    await loggedIn.removeFromCart('Sauce Labs Backpack');
    await expect(loggedIn.cartBadge).toHaveText('1');

    await loggedIn.removeFromCart('Sauce Labs Bike Light');
    await expect(loggedIn.cartBadge).toBeHidden();
  });
});
