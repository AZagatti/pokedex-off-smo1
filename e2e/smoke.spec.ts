import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { exact: true, name: "Pokédex" })
  ).toBeVisible();
});
