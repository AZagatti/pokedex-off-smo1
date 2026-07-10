import { getPokemonList } from "$lib/api/pokeapi";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const list = await getPokemonList(2000, 0, fetch);
  return { pokemonIndex: list.results };
};
