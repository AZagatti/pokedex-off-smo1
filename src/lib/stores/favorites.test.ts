import { favoritesStore } from "$lib/stores/favorites.svelte";
import { beforeEach, describe, expect, it } from "vitest";

describe("favoritesStore", () => {
  beforeEach(() => {
    localStorage.clear();
    favoritesStore.names = [];
  });

  it("toggles a name in and out of favorites", () => {
    expect(favoritesStore.has("pikachu")).toBe(false);

    favoritesStore.toggle("pikachu");
    expect(favoritesStore.has("pikachu")).toBe(true);
    expect(
      JSON.parse(localStorage.getItem("pokedex-favorites") ?? "[]")
    ).toEqual(["pikachu"]);

    favoritesStore.toggle("pikachu");
    expect(favoritesStore.has("pikachu")).toBe(false);
  });
});
