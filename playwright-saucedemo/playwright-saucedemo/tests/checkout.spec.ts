import { test, expect } from '../fixtures/test';
import { checkoutInfo } from '../fixtures/users';

test.describe('Checkout', () => {
  test('complete purchase end to end @smoke', async ({ page, loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Onesie');
    await loggedIn.openCart();

    await expect(cartPage.cartItems).toHaveCount(2);
    await cartPage.checkout();

    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
    await expect(page).toHaveURL(/checkout-step-two/);
    // Backpack $29.99 + Onesie $7.99
    await expect(checkoutPage.subtotal).toContainText('$37.98');

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('checkout requires first name', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo('', checkoutInfo.lastName, checkoutInfo.postalCode);
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('continue shopping returns to inventory', async ({ page, loggedIn, cartPage }) => {
    await loggedIn.openCart();
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
