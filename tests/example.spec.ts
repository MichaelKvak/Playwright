import { test, expect } from "@playwright/test";

test.only("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Hillel Qauto/);
  const heroDescriptor = page.locator("div.hero-descriptor h1");
  await expect(heroDescriptor).toHaveText("Do more!");
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});
