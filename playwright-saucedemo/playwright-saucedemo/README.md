# Playwright SauceDemo Test Suite

End-to-end UI tests for [saucedemo.com](https://www.saucedemo.com) built with **Playwright + TypeScript** using the **Page Object Model**.

## What's covered

| Area | Tests |
|---|---|
| Login | valid login, locked-out user, wrong password, required-field validation, logout, protected route |
| Inventory | product count, sort by price (both ways) and name, add/remove updates cart badge |
| Checkout | full purchase flow with subtotal check, required-field validation, continue shopping |

Runs on Chromium, Firefox and WebKit. Tests tagged `@smoke` form a quick sanity suite.

## Project structure

```
├── pages/                 # Page Objects (locators + actions)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/
│   ├── test.ts            # Custom fixtures: page objects + a pre-logged-in `loggedIn` fixture
│   └── users.ts           # Test data (public demo credentials)
├── tests/                 # Specs
├── playwright.config.ts   # Base URL, browsers, retries, traces/screenshots/video on failure
└── .github/workflows/     # CI: runs on every push/PR and uploads the HTML report
```

## Getting started

```bash
npm install
npx playwright install      # downloads browsers
npm test                    # all browsers, headless
```

## Useful commands

| Command | What it does |
|---|---|
| `npm run test:smoke` | Only `@smoke` tests |
| `npm run test:chromium` | Chromium only |
| `npm run test:headed` | Watch the browser run |
| `npm run test:ui` | Playwright's interactive UI mode |
| `npm run report` | Open the last HTML report |
| `npm run codegen` | Record actions to generate locators |

## Design choices

- **`data-test` locators** via `testIdAttribute` — stable selectors that don't break when styling changes.
- **Fixtures over `beforeEach` login** — `loggedIn` gives every test a fresh, authenticated session with one line.
- **Data-driven tests** for login validation cases.
- **Debugging artifacts** — trace on retry, screenshot and video on failure.
