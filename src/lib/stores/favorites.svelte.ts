const STORAGE_KEY = "pokedex-favorites";

const loadFavorites = (): string[] => {
  if (typeof localStorage === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v) => typeof v === "string")
      : [];
  } catch {
    return [];
  }
};

class FavoritesStore {
  names = $state<string[]>(loadFavorites());

  has(name: string) {
    return this.names.includes(name);
  }

  toggle(name: string) {
    this.names = this.has(name)
      ? this.names.filter((n) => n !== name)
      : [...this.names, name];
    this.persist();
  }

  private persist() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.names));
    }
  }
}

export const favoritesStore = new FavoritesStore();
export { STORAGE_KEY as FAVORITES_STORAGE_KEY };
