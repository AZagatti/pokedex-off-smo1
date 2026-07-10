import { expect, test } from "@playwright/test";

test.describe("Pokédex list", () => {
  test("loads the grid and links into a detail page", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { exact: true, name: "Pokédex" })
    ).toBeVisible();

    const firstCard = page.getByRole("link", { name: /Bulbasaur/u });
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    await expect(page).toHaveURL(/\/pokemon\/bulbasaur/u);
    await expect(
      page.getByRole("heading", { level: 1, name: "Bulbasaur" })
    ).toBeVisible();
  });

  test("searches by name with debounce", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("searchbox", { name: "Search Pokémon by name" })
      .fill("pikachu");
    await expect(page.getByRole("link", { name: /Pikachu/u })).toBeVisible();
    await expect(page.getByRole("link", { name: /Bulbasaur/u })).toHaveCount(0);
  });

  test("shows an empty state and clears filters", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("searchbox", { name: "Search Pokémon by name" })
      .fill("zzznotapokemon");
    await expect(page.getByText("No Pokémon found")).toBeVisible();

    await page.getByRole("button", { name: "Clear filters" }).first().click();
    await expect(
      page.getByRole("searchbox", { name: "Search Pokémon by name" })
    ).toHaveValue("");
    await expect(page.getByRole("link", { name: /Bulbasaur/u })).toBeVisible();
  });

  test("filters by type", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { exact: true, name: "Fire" }).click();
    await expect(page.getByRole("link", { name: /Charmander/u })).toBeVisible();
    await expect(page.getByRole("link", { name: /Squirtle/u })).toHaveCount(0);
  });

  test("toggles favorite from the list and it persists on reload", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Add Bulbasaur to favorites" })
      .click();
    await expect(
      page.getByRole("button", { name: "Remove Bulbasaur from favorites" })
    ).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("button", { name: "Remove Bulbasaur from favorites" })
    ).toBeVisible();

    await page.goto("/favorites");
    await expect(page.getByRole("link", { name: /Bulbasaur/u })).toBeVisible();
  });

  test("toggles theme and persists across reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/u);

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(html).toHaveClass(/dark/u);

    await page.reload();
    await expect(html).toHaveClass(/dark/u);
  });
});

test.describe("Detail page", () => {
  test("shows stats, abilities, and an evolution chain", async ({ page }) => {
    await page.goto("/pokemon/charizard");
    await expect(
      page.getByRole("heading", { level: 1, name: "Charizard" })
    ).toBeVisible();
    await expect(page.getByRole("meter", { name: "HP" })).toBeVisible();
    await expect(page.getByText("Blaze")).toBeVisible();
    await expect(page.getByRole("link", { name: /Charmander/u })).toBeVisible();
    await expect(page.getByRole("link", { name: /Charmeleon/u })).toBeVisible();
  });

  test("switches sprite variants", async ({ page }) => {
    await page.goto("/pokemon/pikachu");
    await page.getByRole("button", { name: "Shiny front" }).click();
    await expect(
      page.getByRole("button", { name: "Shiny front" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("navigates back to the Pokédex", async ({ page }) => {
    await page.goto("/pokemon/pikachu");
    await page.getByRole("link", { name: "Back to Pokédex" }).click();
    await expect(page).toHaveURL("/");
  });

  test("shows a 404 for an unknown Pokémon", async ({ page }) => {
    await page.goto("/pokemon/not-a-real-pokemon");
    await expect(page.getByText("404")).toBeVisible();
  });
});

test.describe("Berries", () => {
  test("lists berries and shows a detail page", async ({ page }) => {
    await page.goto("/berries");
    await expect(
      page.getByRole("heading", { level: 1, name: "Berries" })
    ).toBeVisible();

    await page.getByRole("link", { name: /Cheri Berry/u }).click();
    await expect(page).toHaveURL(/\/berries\/cheri/u);
    await expect(
      page.getByRole("heading", { level: 1, name: "Cheri Berry" })
    ).toBeVisible();
    await expect(page.getByText("Spicy")).toBeVisible();
  });
});

test.describe("404", () => {
  test("shows a 404 page for an unknown route", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
  });
});
