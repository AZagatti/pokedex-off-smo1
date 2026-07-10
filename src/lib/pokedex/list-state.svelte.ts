import { getGeneration, getPokemon, getType } from "$lib/api/pokeapi";
import type { NamedApiResource } from "$lib/api/schemas";
import { idFromResourceUrl } from "$lib/utils";

const PAGE_SIZE = 30;
const CONCURRENCY = 12;
const STAT_SORT_FETCH_CAP = 200;

export type SortMode = "dex" | "stat-total";

const mapWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = Array.from({ length: items.length });
  let cursor = 0;

  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      // Deliberately sequential within a single worker — concurrency comes
      // from running `limit` of these workers in parallel below.
      // oxlint-disable-next-line no-await-in-loop
      results[index] = await fn(items[index] as T);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  );
  return results;
};

export class PokedexListState {
  allPokemon: NamedApiResource[] = $state([]);
  search = $state("");
  selectedGeneration = $state<number | null>(null);
  selectedTypes = $state<Set<string>>(new Set());
  sortMode = $state<SortMode>("dex");
  visibleCount = $state(PAGE_SIZE);
  statTotals = $state<Map<string, number>>(new Map());
  loadingStats = $state(false);
  generationMembers = $state<Map<number, Set<string>>>(new Map());
  typeMembers = $state<Map<string, Set<string>>>(new Map());
  filterError = $state<string | null>(null);
  statSortCapped = $state(false);

  private debounceHandle: ReturnType<typeof setTimeout> | undefined;
  searchInput = $state("");

  constructor(allPokemon: NamedApiResource[]) {
    this.allPokemon = allPokemon;
  }

  setSearchInput(value: string) {
    this.searchInput = value;
    clearTimeout(this.debounceHandle);
    this.debounceHandle = setTimeout(() => {
      this.search = value.trim().toLowerCase();
      this.resetPagination();
    }, 250);
  }

  async setGeneration(id: number | null) {
    this.selectedGeneration = id;
    this.resetPagination();
    if (id === null || this.generationMembers.has(id)) {
      return;
    }
    try {
      const generation = await getGeneration(id);
      const members = new Set(generation.pokemon_species.map((s) => s.name));
      this.generationMembers = new Map(this.generationMembers).set(id, members);
    } catch {
      this.filterError = "Couldn't load that generation. Try again.";
    }
  }

  async toggleType(type: string) {
    const next = new Set(this.selectedTypes);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    this.selectedTypes = next;
    this.resetPagination();

    if (next.has(type) && !this.typeMembers.has(type)) {
      try {
        const detail = await getType(type);
        const members = new Set(detail.pokemon.map((p) => p.pokemon.name));
        this.typeMembers = new Map(this.typeMembers).set(type, members);
      } catch {
        this.filterError = "Couldn't load that type. Try again.";
      }
    }
  }

  clearFilters() {
    this.search = "";
    this.searchInput = "";
    this.selectedGeneration = null;
    this.selectedTypes = new Set();
    this.sortMode = "dex";
    this.resetPagination();
  }

  hasActiveFilters = $derived(
    this.search !== "" ||
      this.selectedGeneration !== null ||
      this.selectedTypes.size > 0 ||
      this.sortMode !== "dex"
  );

  filtered = $derived.by((): NamedApiResource[] => {
    let candidates = this.allPokemon;

    if (this.search) {
      candidates = candidates.filter((p) => p.name.includes(this.search));
    }

    if (this.selectedGeneration !== null) {
      const members = this.generationMembers.get(this.selectedGeneration);
      candidates = members ? candidates.filter((p) => members.has(p.name)) : [];
    }

    if (this.selectedTypes.size > 0) {
      const sets = [...this.selectedTypes].map((t) => this.typeMembers.get(t));
      candidates = sets.some((s) => s === undefined)
        ? []
        : candidates.filter((p) => sets.some((s) => s?.has(p.name)));
    }

    return candidates;
  });

  sorted = $derived.by((): NamedApiResource[] => {
    const list = this.filtered;
    if (this.sortMode === "dex") {
      return [...list].toSorted(
        (a, b) => idFromResourceUrl(a.url) - idFromResourceUrl(b.url)
      );
    }
    return [...list].toSorted((a, b) => {
      const totalA = this.statTotals.get(a.name) ?? -1;
      const totalB = this.statTotals.get(b.name) ?? -1;
      return totalB - totalA;
    });
  });

  visible = $derived.by((): NamedApiResource[] =>
    this.sorted.slice(0, this.visibleCount)
  );

  hasMore = $derived(this.visibleCount < this.sorted.length);

  loadMore() {
    this.visibleCount += PAGE_SIZE;
  }

  resetPagination() {
    this.visibleCount = PAGE_SIZE;
  }

  async setSortMode(mode: SortMode) {
    this.sortMode = mode;
    this.resetPagination();
    if (mode !== "stat-total") {
      return;
    }
    const candidates = this.filtered;
    this.statSortCapped = candidates.length > STAT_SORT_FETCH_CAP;
    const missing = candidates
      .slice(0, STAT_SORT_FETCH_CAP)
      .filter((p) => !this.statTotals.has(p.name));
    if (missing.length === 0) {
      return;
    }
    this.loadingStats = true;
    try {
      await mapWithConcurrency(missing, CONCURRENCY, async (p) => {
        const detail = await getPokemon(p.name);
        const total = detail.stats.reduce((sum, s) => sum + s.base_stat, 0);
        this.statTotals = new Map(this.statTotals).set(p.name, total);
      });
    } catch {
      this.filterError = "Couldn't load stats for sorting. Try again.";
    } finally {
      this.loadingStats = false;
    }
  }
}
