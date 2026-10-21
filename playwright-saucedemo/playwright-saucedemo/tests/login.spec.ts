import { test, expect } from '../fixtures/test';
import { users, PASSWORD } from '../fixtures/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in @smoke', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut, PASSWORD);
    await expect(loginPage.error).toContainText('Sorry, this user has been locked out');
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(users.standard, 'wrong_password');
    await expect(loginPage.error).toContainText('Username and password do not match');
  });

  const missingFields = [
    { name: 'empty username', user: '', pass: PASSWORD, msg: 'Username is required' },
    { name: 'empty password', user: users.standard, pass: '', msg: 'Password is required' },
  ];
  for (const { name, user, pass, msg } of missingFields) {
    test(`validation: ${name}`, async ({ loginPage }) => {
      await loginPage.login(user, pass);
      await expect(loginPage.error).toContainText(msg);
    });
  }

  test('user can log out @smoke', async ({ page, loggedIn }) => {
    await loggedIn.logout();
    await expect(page).toHaveURL('/');
  });

  test('inventory is protected without login', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
